import SwiftUI
import SwiftData

struct FamilyView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var store = FamilyStore()
    @State private var showingAddSheet = false

    var body: some View {
        NavigationStack {
            Group {
                if store.members.isEmpty {
                    emptyState
                } else {
                    memberList
                }
            }
            .navigationTitle("Family Protection")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button { showingAddSheet = true } label: {
                        Label("Add Member", systemImage: "person.badge.plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddSheet) {
                AddFamilyMemberSheet(store: store)
            }
            .onAppear {
                store.configure(with: modelContext)
            }
        }
    }

    // MARK: - Subviews

    private var memberList: some View {
        List {
            Section {
                ForEach(store.members) { member in
                    MemberRow(member: member, store: store)
                }
                .onDelete { indexSet in
                    indexSet.forEach { store.deleteMember(store.members[$0]) }
                }
            } header: {
                Text("\(store.protectedMembers.count) of \(store.members.count) protected")
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.2.fill")
                .font(.system(size: 56))
                .foregroundStyle(.secondary)
            Text("No Family Members")
                .font(.title2.bold())
            Text("Add family members to receive scam alerts when their calls are flagged.")
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 40)
            Button("Add Family Member") { showingAddSheet = true }
                .buttonStyle(.borderedProminent)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Member Row

private struct MemberRow: View {
    let member: FamilyMember
    let store: FamilyStore

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(member.name).font(.headline)
                    Text(member.displayRelationship).font(.subheadline).foregroundStyle(.secondary)
                    Text(member.phoneNumber).font(.caption).foregroundStyle(.secondary)
                }
                Spacer()
                if member.totalIncidents > 0 {
                    VStack(spacing: 2) {
                        Text("\(member.totalIncidents)")
                            .font(.title3.bold())
                            .foregroundStyle(.red)
                        Text("alerts")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Divider()

            HStack {
                Toggle(isOn: Binding(
                    get: { member.isProtected },
                    set: { _ in store.toggleProtection(for: member) }
                )) {
                    Label("Protect", systemImage: "shield.fill")
                        .font(.caption)
                }
                .toggleStyle(.button)
                .tint(.blue)

                Spacer()

                Toggle(isOn: Binding(
                    get: { member.notificationsEnabled },
                    set: { _ in store.toggleNotifications(for: member) }
                )) {
                    Label("Notify", systemImage: "bell.fill")
                        .font(.caption)
                }
                .toggleStyle(.button)
                .tint(.orange)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Add Sheet

private struct AddFamilyMemberSheet: View {
    let store: FamilyStore
    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var phone = ""
    @State private var relationship = ""

    private var isValid: Bool { !name.trimmingCharacters(in: .whitespaces).isEmpty && !phone.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        NavigationStack {
            Form {
                Section("Contact Info") {
                    TextField("Full Name", text: $name)
                    TextField("Phone Number", text: $phone)
                        .keyboardType(.phonePad)
                }
                Section("Relationship (optional)") {
                    TextField("e.g. Mom, Dad, Grandma", text: $relationship)
                }
            }
            .navigationTitle("Add Family Member")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        store.addMember(name: name, phoneNumber: phone, relationship: relationship)
                        dismiss()
                    }
                    .disabled(!isValid)
                }
            }
        }
    }
}

#Preview {
    FamilyView()
        .modelContainer(for: FamilyMember.self, inMemory: true)
}
