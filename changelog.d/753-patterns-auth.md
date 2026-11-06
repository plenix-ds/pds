### Changed

- TypeScript wave 3, Auth (#753, ADR 0011): the Auth forms are now `.tsx` with exported prop types: `AuthProps`, `SignInFormProps`, `SignUpFormProps`, `PasswordResetFormProps`, `MfaChallengeProps` (`MfaMethod`), `SsoButtonsProps` (`SsoProvider`), `AccountRecoveryProps` and `AuthLink`. No `any` in a public prop. No behavior change.
