# Twilio SMS Setup for ScamShield LE

ScamShield LE uses Twilio as a backup notification channel. When a scam is detected on a
family member's call, an SMS is sent to the guardian if FCM push fails or if SMS is explicitly enabled.

## 1. Create a Twilio Account

1. Go to [twilio.com](https://www.twilio.com) and create a free account
2. Verify your phone number during sign-up

## 2. Get a Phone Number

1. In the Twilio Console, go to **Phone Numbers → Manage → Buy a number**
2. Purchase a number with SMS capability (~$1/month)

## 3. Get Your Credentials

From the [Twilio Console dashboard](https://console.twilio.com):
- **Account SID** — starts with `AC`
- **Auth Token** — click the eye icon to reveal

## 4. Add to local.properties

Add the following to your `local.properties` file (never commit this file):

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+1xxxxxxxxxx
```

## 5. Costs

| Action | Cost |
|---|---|
| Phone number rental | ~$1.00/month |
| SMS (outbound, US) | ~$0.0079/message |
| SMS (outbound, international) | $0.05–$0.20/message |

For family guardian alerts (low volume), SMS costs are negligible.

## 6. How It Works

```
Scam detected
    └─> Try FCM push notification
            ├─ Success + guardian.smsEnabled = true  → also send SMS
            └─ Failure                               → send SMS fallback
```

The `GuardianNotificationOrchestrator` handles this logic. Analytics events track
which channel succeeded (`fcm_only`, `sms_only`, `both`, or `none`).

## 7. Upgrade Path

| Feature | Service |
|---|---|
| Two-factor auth | [Twilio Verify](https://www.twilio.com/verify) |
| Two-way messaging | [Twilio Conversations](https://www.twilio.com/conversations) |
| Voice calls | [Twilio Voice](https://www.twilio.com/voice) |
| WhatsApp alerts | [Twilio WhatsApp](https://www.twilio.com/whatsapp) |

## 8. Testing

Use the Twilio Console **Test Credentials** (Account SID starts with `AC` + `test`)
to send test messages without charges. Test numbers: `+15005550006` (valid from),
`+15005550004` (invalid number — use to test error handling).
