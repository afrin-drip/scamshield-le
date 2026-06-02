import Foundation
import os.log

// TODO: Replace os_log calls with Firebase Crashlytics iOS SDK once integrated.
// See CRASHLYTICS_SETUP.md for Swift Package Manager integration instructions.

final class CrashReporter {

    static let shared = CrashReporter()
    private let logger = Logger(
        subsystem: Bundle.main.bundleIdentifier ?? "com.scamshield.le",
        category: "CrashReporter"
    )

    private init() {}

    // MARK: - Scam Detection

    func logScamDetected(score: Int, signals: [String]) {
        logger.warning("SCAM_DETECTED: score=\(score) signals=\(signals.joined(separator: ","))")
        // TODO: Crashlytics.crashlytics().setCustomValue(score, forKey: "last_scam_score")
        // TODO: Crashlytics.crashlytics().record(exceptionModel: ExceptionModel(className: "ScamDetected", message: "score=\(score)"))
    }

    // MARK: - Permissions

    func logPermissionDenied(permission: String) {
        logger.warning("PERMISSION_DENIED: \(permission)")
        // TODO: Crashlytics.crashlytics().setCustomValue(permission, forKey: "last_denied_permission")
        // TODO: Crashlytics.crashlytics().record(exceptionModel: ExceptionModel(className: "PermissionDenied", message: permission))
    }

    // MARK: - User Tier

    func setUserTier(_ tier: String) {
        logger.info("USER_TIER: \(tier)")
        // TODO: Crashlytics.crashlytics().setCustomValue(tier, forKey: "user_tier")
    }

    // MARK: - API Errors

    func logApiError(endpoint: String, code: Int) {
        logger.error("API_ERROR: endpoint=\(endpoint) code=\(code)")
        // TODO: Crashlytics.crashlytics().setCustomValue(endpoint, forKey: "last_api_endpoint")
        // TODO: Crashlytics.crashlytics().setCustomValue(code, forKey: "last_api_error_code")
        // TODO: Crashlytics.crashlytics().record(exceptionModel: ExceptionModel(className: "ApiError", message: "\(endpoint) returned \(code)"))
    }

    // MARK: - Generic

    func recordError(_ error: Error, context: String) {
        logger.error("EXCEPTION [\(context)]: \(error.localizedDescription)")
        // TODO: Crashlytics.crashlytics().setCustomValue(context, forKey: "exception_context")
        // TODO: Crashlytics.crashlytics().record(error: error)
    }
}