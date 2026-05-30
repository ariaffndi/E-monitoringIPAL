import { Form, Head } from '@inertiajs/react';
import { Mail, LockKeyhole } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
// import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    // canRegister,
}: Props) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative flex flex-col gap-4 p-6 md:p-10">
                {/* LOGO TETAP */}
                <div className="flex gap-2 md:justify-start">
                    <AppLogo textClassName="text-2xl" iconClassName="size-8" />
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        <>
                            <Head title="Log in" />

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* HEADER */}
                                        <div className="space-y-2">
                                            <h1 className="text-3xl font-bold tracking-tight">
                                                Sign in to your account
                                            </h1>

                                            <p className="text-muted-foreground">
                                                Monitor and manage wastewater
                                                treatment operations
                                                efficiently.
                                            </p>
                                        </div>

                                        {/* FORM */}
                                        <div className="space-y-5">
                                            {/* EMAIL */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                                >
                                                    Email Address
                                                </Label>

                                                <div className="relative">
                                                    <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoFocus
                                                        autoComplete="email"
                                                        placeholder="name@company.com"
                                                        className="h-12 pl-10"
                                                    />
                                                </div>

                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>

                                            {/* PASSWORD */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="password"
                                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                                >
                                                    Password
                                                </Label>

                                                <div className="relative">
                                                    <LockKeyhole className="absolute top-1/2 left-3 z-1 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                                                    <PasswordInput
                                                        id="password"
                                                        name="password"
                                                        required
                                                        autoComplete="current-password"
                                                        placeholder="••••••••"
                                                        className="h-12 pl-10"
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>

                                            {/* REMEMBER + FORGOT */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                    />

                                                    <Label htmlFor="remember">
                                                        Remember me
                                                    </Label>
                                                </div>

                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="font-medium"
                                                    >
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>

                                            {/* BUTTON */}
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-12 w-full cursor-pointer bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700"
                                            >
                                                {processing && <Spinner />}

                                                <span>
                                                    Sign In to Dashboard
                                                </span>
                                            </Button>
                                        </div>

                                        {/* FOOTER INFO */}
                                        <div className="border-t pt-6">
                                            <p className="text-sm text-muted-foreground">
                                                Secure access to the WWTP
                                                Monitoring System.
                                            </p>
                                        </div>

                                        {/* REGISTER (TETAP DIKEEP COMMENT) */}

                                        {/*
                            {canRegister && (
                                <div className="text-center text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <TextLink href={register()}>
                                        Sign up
                                    </TextLink>
                                </div>
                            )}
                            */}
                                    </>
                                )}
                            </Form>

                            {status && (
                                <div className="mt-4 text-center text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}
                        </>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="absolute bottom-6 left-6 text-xs tracking-wide text-muted-foreground md:left-10">
                    © 2025 E-Monitoring IPAL. All rights reserved.
                </div>
            </div>
            <div className="relative hidden overflow-hidden bg-muted lg:block">
                {/* IMAGE */}
                <img
                    src="/images/login-image.png"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/10" />

                {/* TEXT */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-10">
                    <div className="mx-auto max-w-xl text-center text-white">
                        <p className="text-2xl leading-tight font-bold">
                            Optimized WWTP Management Dashboard
                        </p>

                        <p className="mt-4 text-sm leading-relaxed text-white/90">
                            Everything you need to monitor, analyze, and improve
                            your wastewater treatment performance in one
                            customizable view.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
