import SwiftUI

struct AgencyDirectoryView: View {
    private let directory = AgencyDirectory.shared

    var body: some View {
        List {
            ForEach(Agency.AgencyCategory.allCases, id: \.rawValue) { category in
                let agencies = directory.agencies.filter { $0.category == category }
                if !agencies.isEmpty {
                    Section(category.rawValue) {
                        ForEach(agencies) { agency in AgencyRow(agency: agency) }
                    }
                }
            }
        }
        .navigationTitle("Agency Directory")
        .navigationBarTitleDisplayMode(.large)
    }
}

struct AgencyRow: View {
    let agency: Agency
    @State private var showCallConfirm = false

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(agency.name).font(.headline)
            Text(agency.description).font(.caption).foregroundStyle(.secondary)
            HStack(spacing: 16) {
                Button { showCallConfirm = true } label: {
                    Label(agency.phone, systemImage: "phone.fill")
                        .font(.caption.bold()).foregroundStyle(.blue)
                }.buttonStyle(.plain)
                Link(destination: URL(string: agency.website)!) {
                    Label("Website", systemImage: "safari")
                        .font(.caption.bold()).foregroundStyle(.blue)
                }
            }.padding(.top, 2)
        }
        .padding(.vertical, 4)
        .confirmationDialog("Call \(agency.name)?", isPresented: $showCallConfirm) {
            if let url = URL(string: "tel://\(agency.phone.filter { $0.isNumber || $0 == "+" })") {
                Link("Call \(agency.phone)", destination: url)
            }
            Button("Cancel", role: .cancel) {}
        }
    }
}
