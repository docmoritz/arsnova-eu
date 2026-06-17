# Session Lifecycle

- Session status flow: `LOBBY` -> optional `QUESTION_OPEN` -> `ACTIVE` -> `RESULTS` -> optional `DISCUSSION`/`PAUSED` -> next question or `FINISHED`.
- Reading phase: when `readingPhaseEnabled=true`, host action for next question first enters `QUESTION_OPEN` and only shows the question stem. Host then reveals answers to enter `ACTIVE`.
- Without reading phase, next question can enter `ACTIVE` directly.
- Important live events/subscriptions include question revealed, answers revealed, results revealed, status changed, participant joined, and personal result/scorecard updates.
- Peer Instruction can use multiple rounds; preserve the effective-vote rule for scoring, leaderboards, bonus tokens, and exports.
- Canonical live state is in PostgreSQL; websocket/subscription clients must tolerate reconnect/resync behavior.
- Host views must keep a stable HTTP snapshot fallback (`session.getInfo` with neutral `currentQuestion`/`currentRound`) for active quiz sessions. Do not rely solely on websocket status events after reload/reconnect.
- Host-only realtime channels can fail because of host-token/WS reconnect timing. On subscription errors, avoid immediate recursive resubscribe + full refresh loops; use serialized fallback refreshes and throttled resubscribe, and only disable fallback once the host current-question subscription yields data again.
- Under high vote load, do not invalidate or emit the full host current-question DTO for every vote. Use the lightweight host vote-progress channel (`HostVoteProgressDTO`) for live `ACTIVE` counts, coalesce vote-driven progress signals briefly, and keep full question/result DTO refreshes tied to phase/question changes or explicit result loading.
- Participant DTO shape depends on phase; read `mem:security/dto-stripping` before changing session payloads.

## Verwandte Memories:

- `mem:core`
- `mem:security/dto-stripping`
- `mem:backend/api-router`
- `mem:frontend/routing-components`
- `mem:modules/data-runtime`
- `mem:quality/dod`
