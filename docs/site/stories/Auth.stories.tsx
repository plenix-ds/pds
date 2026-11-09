// States: sign in (default, error), sign up (errors), password reset steps, MFA, SSO, account recovery. Hover, focus and active are on the fields and buttons: focus is reached by play. Not applicable: disabled, loading (busy), selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Auth, SignInForm, SignUpForm, PasswordResetForm, MfaChallenge, SsoButtons, AccountRecovery } from '../../../platform/patterns/Auth/Auth.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/Auth', component: Auth, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { title: 'Sign in to Plenix', description: 'Use your Plenix user name or email.' } } satisfies Meta<typeof Auth>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Auth {...args}><SignInForm onSubmit={() => {}} forgot={{ href: '#/reset' }} signUp={{ href: '#/sign-up' }} /></Auth> };
export const Focus: Story = { render: Default.render, play: async () => { await userEvent.tab(); } };
export const SignInError: Story = { render: (args) => <Auth {...args}><SignInForm onSubmit={() => {}} error="The user name or password is not right." /></Auth> };
export const SignInBusy: Story = { render: (args) => <Auth {...args}><SignInForm onSubmit={() => {}} busy /></Auth> };
export const WithSso: Story = { render: (args) => <Auth {...args}><SignInForm onSubmit={() => {}} sso={<SsoButtons providers={[{ id: 'google', label: 'Google' }]} />} /></Auth> };
export const SignUp: Story = { args: { title: 'Create your account', description: undefined }, render: (args) => <Auth {...args}><SignUpForm onSubmit={() => {}} /></Auth> };
export const SignUpErrors: Story = { args: SignUp.args, render: (args) => <Auth {...args}><SignUpForm onSubmit={() => {}} errors={{ name: 'Enter your name', email: 'Enter a valid email', password: 'Use at least 12 characters', terms: 'Agree to the terms' }} /></Auth> };
export const ResetRequest: Story = { args: { title: 'Reset your password', description: undefined }, render: (args) => <Auth {...args}><PasswordResetForm step="request" onRequest={() => {}} /></Auth> };
export const ResetSent: Story = { args: ResetRequest.args, render: (args) => <Auth {...args}><PasswordResetForm step="sent" onResend={() => {}} /></Auth> };
export const ResetNew: Story = { args: ResetRequest.args, render: (args) => <Auth {...args}><PasswordResetForm step="new" onReset={() => {}} /></Auth> };
export const Mfa: Story = { args: { title: 'Verify it is you', description: undefined }, render: (args) => <Auth {...args}><MfaChallenge onVerify={() => {}} /></Auth> };
export const Recovery: Story = { args: { title: 'Recover your account', description: undefined }, render: (args) => <Auth {...args}><AccountRecovery step="choose" /></Auth> };
export const LongText: Story = { args: { title: 'Sign in to the shared workspace of the regional office for the northern and eastern provinces', description: 'Use your Plenix user name or the email address that the finance committee secretary registered for you.' }, render: Default.render };
export const Rtl: Story = { decorators: [rtl], render: Default.render };
