import StoreKit
import SwiftUI

@Observable
class StoreKitManager {
    var currentTier: SubscriptionTier = .free
    var products: [Product] = []
    var purchaseInProgress = false
    var errorMessage: String?

    private var updates: Task<Void, Never>?

    init() {
        updates = Task { await listenForTransactionUpdates() }
        Task { await loadProducts(); await checkCurrentEntitlements() }
    }
    deinit { updates?.cancel() }
    func loadProducts() async { do { let f = try await Product.products(for: ProductIdentifiers.all); await MainActor.run { products = f.sorted { $0.price < $1.price } } } catch { await MainActor.run { errorMessage = error.localizedDescription } } }
    func purchase(_ product: Product) async -> Bool {
        await MainActor.run { purchaseInProgress = true }
        defer { Task { @MainActor in purchaseInProgress = false } }
        do { let r = try await product.purchase()
            if case .success(let v) = r, let t = try? checkVerified(v) { await updateTier(for: t); await t.finish(); return true }
            return false
        } catch { await MainActor.run { errorMessage = error.localizedDescription }; return false }
    }
    func restorePurchases() async { do { try await AppStore.sync(); await checkCurrentEntitlements() } catch { await MainActor.run { errorMessage = error.localizedDescription } } }
    func checkCurrentEntitlements() async {
        var h: SubscriptionTier = .free
        for await r in Transaction.currentEntitlements { if let t = try? checkVerified(r) { if t.productID == ProductIdentifiers.familyMonthly { h = .family } else if t.productID == ProductIdentifiers.proMonthly && h != .family { h = .pro } } }
        await MainActor.run { currentTier = h; UserDefaults.standard.set(h.rawValue, forKey: "subscription_tier") }
    }
    private func updateTier(for t: Transaction) async { let tier: SubscriptionTier = t.productID == ProductIdentifiers.familyMonthly ? .family : t.productID == ProductIdentifiers.proMonthly ? .pro : .free; await MainActor.run { currentTier = tier } }
    private func checkVerified<T>(_ r: VerificationResult<T>) throws -> T { guard case .verified(let s) = r else { throw StoreError.failedVerification }; return s }
    private func listenForTransactionUpdates() async { for await r in Transaction.updates { if let t = try? checkVerified(r) { await updateTier(for: t); await t.finish() } } }
}
enum StoreError: Error { case failedVerification }
