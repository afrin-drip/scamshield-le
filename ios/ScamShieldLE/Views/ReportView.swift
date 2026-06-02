import SwiftUI

struct ReportView: View {
    // Pre-populated from a detected incident (optional)
    var prefillData: ReportGenerator.ReportData?

    @State private var callerClaimed = ""
    @State private var phoneNumber = ""
    @State private var amountRequested = ""
    @State private var paymentMethod = ""
    @State private var additionalDetails = ""
    @State private var showingShareSheet = false
    @State private var generatedReport = ""

    private let paymentOptions = ["", "Gift Cards", "Cryptocurrency", "Wire Transfer", "Cash", "Zelle / Venmo", "Other"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Caller Information") {
                    TextField("Claimed to be (e.g. FBI, IRS, Police)", text: $callerClaimed)
                    TextField("Their phone number", text: $phoneNumber)
                        .keyboardType(.phonePad)
                }

                Section("Financial Details") {
                    TextField("Amount requested (e.g. $2,000)", text: $amountRequested)
                    Picker("Payment method", selection: $paymentMethod) {
                        ForEach(paymentOptions, id: \.self) { Text($0.isEmpty ? "Select…" : $0) }
                    }
                }

                Section("Additional Details") {
                    TextEditor(text: $additionalDetails)
                        .frame(minHeight: 80)
                }

                Section("Submit Report") {
                    ReportLinkButton(
                        title: "Report to FTC",
                        subtitle: "reportfraud.ftc.gov",
                        icon: "arrow.up.right.square.fill",
                        color: .blue,
                        url: "https://reportfraud.ftc.gov"
                    )
                    ReportLinkButton(
                        title: "Report to FBI IC3",
                        subtitle: "ic3.gov",
                        icon: "arrow.up.right.square.fill",
                        color: .red,
                        url: "https://ic3.gov"
                    )
                    Button {
                        generateAndShare()
                    } label: {
                        Label("Share Incident Summary", systemImage: "square.and.arrow.up")
                    }
                }
            }
            .navigationTitle("Report a Scam")
            .navigationBarTitleDisplayMode(.large)
            .onAppear { applyPrefill() }
            .sheet(isPresented: $showingShareSheet) {
                ActivityView(activityItems: [generatedReport])
            }
        }
    }

    // MARK: - Actions

    private func applyPrefill() {
        guard let data = prefillData else { return }
        callerClaimed = data.callerClaimedToBeFrom
        phoneNumber = data.callerPhoneNumber
        amountRequested = data.amountRequested
        paymentMethod = data.paymentMethod
        additionalDetails = data.additionalDetails
    }

    private func generateAndShare() {
        var data = ReportGenerator.ReportData()
        data.callerClaimedToBeFrom = callerClaimed
        data.callerPhoneNumber = phoneNumber
        data.amountRequested = amountRequested
        data.paymentMethod = paymentMethod
        data.additionalDetails = additionalDetails

        if let prefill = prefillData {
            data.detectedSignals = prefill.detectedSignals
            data.riskLevel = prefill.riskLevel
            data.aiExplanation = prefill.aiExplanation
            data.dateOfCall = prefill.dateOfCall
        }

        generatedReport = ReportGenerator.generate(from: data)
        showingShareSheet = true
    }
}

// MARK: - Report Link Button

private struct ReportLinkButton: View {
    let title: String
    let subtitle: String
    let icon: String
    let color: Color
    let url: String

    var body: some View {
        Button {
            if let url = URL(string: url) {
                UIApplication.shared.open(url)
            }
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(.body)
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Image(systemName: icon)
                    .foregroundStyle(color)
            }
        }
        .foregroundStyle(.primary)
    }
}

// MARK: - UIActivityViewController wrapper

struct ActivityView: UIViewControllerRepresentable {
    let activityItems: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    ReportView()
}
