import SwiftUI
import StoreKit

struct SubscriptionView: View {
    @Environment(StoreKitManager.self) var store
    @Environment(\.dismiss) var dismiss
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    VStack(spacing: 8) { Text("🛡️").font(.system(size: 56)); Text("ScamShield Protection").font(.title.bold()); Text("Choose the plan that protects you and your family").font(.subheadline).foregroundStyle(.secondary).multilineTextAlignment(.center) }.padding(.top)
                    ForEach(SubscriptionTier.allCases, id: \.self) { tier in TierCard(tier: tier, isCurrentTier: store.currentTier == tier, store: store) }
                    Button("Restore Purchases") { Task { await store.restorePurchases() } }.font(.footnote).foregroundStyle(.secondary)
                    HStack(spacing: 16) { Link("Privacy Policy", destination: URL(string: "https://scamshieldapp.com/privacy")!); Link("Terms of Use", destination: URL(string: "https://scamshieldapp.com/terms")!) }.font(.caption).foregroundStyle(.secondary)
                }.padding()
            }
            .navigationTitle("Upgrade").navigationBarTdtleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .topBarTrailing) { Button("Done") { dismiss() } } }
        }
    }
}
struct TierCard: View {
    let tier: SubscriptionTier; let isCurrentTier: Bool; @Observable var store: StoreKitManager
    var matchingProduct: Product? { switch tier { case .free: return nil; case .pro: return store.products.first { $0.id == ProductIdentifiers.proMonthly }; case .family: return store.products.first { $0.id == ProductIdentifiers.familyMonthly } } }
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack { VStack(alignment: .leading) { Text(tier.displayName).font(.title2.bold()); Text(tier.price).font(.subheadline).foregroundStyle(.secondary) }; Spacer(); if isCurrentTier { Text("Current").font(.caption.bold()).padding(.horizontal, 10).padding(.vertical, 4).background(Color.green.opacity(0.2)).foregroundStyle(.green).clipShape(Capsule()) } }
            ForEach(tier.features, id: \.self) { f in HStack(spacing: 8) { Image(systemName: "checkmark.circle.fill").foregroundStyle(.green).font(.caption); Text(f).font(.subheadline) } }
            if !isCurrentTier, let product = matchingProduct { Button { Task { _ = await store.purchase(product) } } label: { HStack { if store.purchaseInProgress { ProgressView().tint(.white) }; Text("Subscribe for \(product.displayPrice)/month").bold() }.frame(maxWidth: .infinity).padding().background(Color.accentColor).foregroundStyle(.white).clipShape(RoundedRectangle(cornerRadius: 12)) }.disabled(store.purchaseInProgress) }
        }.padding().background(Color(.systemBackground)).clipShape(RoundedRectangle(cornerRadius: 16)).overlay(RoundedRectangle(cornerRadius: 16).stroke(isCurrentTier ? Color.accentColor : Color(.systemGray5), lineWidth: isCurrentTier ? 2 : 1)).shadow(color: .black.opacity(0.05), radius: 4, y: 2)
    }
}
