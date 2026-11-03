import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';

const ALLOWED_DOMAIN = 'hbplus.fit';

const GoogleIcon = () => (
    <svg viewBox="0 0 48 48" className="hb-google-icon" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const css = `
html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #05050a;
}
body { overflow: hidden; }

.hb-root {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #05050a;
    color: #fafafa;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    overflow: hidden;
    box-sizing: border-box;
}
.hb-root *, .hb-root *::before, .hb-root *::after { box-sizing: border-box; }

/* ---------- Background FX ---------- */
.hb-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.hb-grid {
    position: absolute; inset: 0;
    background-image:
        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse at center, #000 15%, transparent 72%);
    -webkit-mask-image: radial-gradient(ellipse at center, #000 15%, transparent 72%);
}
.hb-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.5; }
.hb-orb.a { width: 560px; height: 560px; background: #3b82f6; top: -160px; left: -140px; animation: hb-float-a 18s ease-in-out infinite; }
.hb-orb.b { width: 520px; height: 520px; background: #8b5cf6; bottom: -180px; right: 8%; animation: hb-float-b 22s ease-in-out infinite; }
.hb-orb.c { width: 420px; height: 420px; background: #06b6d4; top: 30%; right: -140px; opacity: 0.35; animation: hb-float-a 26s ease-in-out infinite reverse; }
@keyframes hb-float-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(70px, 50px) scale(1.12); } }
@keyframes hb-float-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-60px, -70px) scale(1.1); } }

/* ---------- Card ---------- */
.hb-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    margin: 0 24px;
    padding: 52px 36px 40px;
    border-radius: 28px;
    background: rgba(18,18,27,0.65);
    border: 1px solid rgba(255,255,255,0.09);
    box-shadow: 0 30px 80px -20px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06);
    backdrop-filter: blur(26px); -webkit-backdrop-filter: blur(26px);
    text-align: center;
    animation: hb-rise 0.9s ease both;
}
@keyframes hb-rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }

.hb-logo {
    width: 76px; height: 76px; margin: 0 auto 28px;
    border-radius: 22px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 29px; letter-spacing: 0.5px; color: #fff;
    box-shadow: 0 0 40px rgba(99,102,241,0.55);
}
.hb-lead { margin: 0 0 32px; color: #a1a1aa; font-size: 15px; line-height: 1.6; }

.hb-error {
    padding: 13px 16px; margin-bottom: 20px; border-radius: 12px;
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.28);
    color: #fca5a5; font-size: 14px; line-height: 1.5;
    animation: hb-shake 0.4s ease;
}
@keyframes hb-shake { 20%,60% { transform: translateX(-5px); } 40%,80% { transform: translateX(5px); } }

.hb-btn {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 16px; border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.14);
    background: linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04));
    color: #fafafa; cursor: pointer; outline: none;
    font-size: 15.5px; font-weight: 600; font-family: inherit;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease;
}
.hb-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%);
    transform: translateX(-120%); transition: transform 0.7s ease;
}
.hb-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: rgba(129,140,248,0.7);
    box-shadow: 0 12px 36px -8px rgba(99,102,241,0.55), 0 0 0 4px rgba(99,102,241,0.12);
}
.hb-btn:hover:not(:disabled)::before { transform: translateX(120%); }
.hb-btn:active:not(:disabled) { transform: translateY(0); }
.hb-btn:focus-visible { box-shadow: 0 0 0 4px rgba(99,102,241,0.35); }
.hb-btn:disabled { cursor: not-allowed; opacity: 0.75; }

.hb-google-icon { width: 22px; height: 22px; margin-right: 12px; flex-shrink: 0; }
.hb-spinner {
    width: 20px; height: 20px; margin-right: 12px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.25); border-top-color: #a78bfa;
    animation: hb-spin 0.8s linear infinite;
}
@keyframes hb-spin { to { transform: rotate(360deg); } }

.hb-divider { display: flex; align-items: center; gap: 14px; margin: 30px 0 22px; color: #52525b; font-size: 12px; text-transform: uppercase; letter-spacing: 1.4px; }
.hb-divider::before, .hb-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

.hb-note {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 13.5px; color: #71717a;
}
.hb-note strong { color: #c4b5fd; font-weight: 600; }
.hb-note svg { color: #34d399; flex-shrink: 0; }

@media (max-width: 480px) {
    .hb-card { margin: 0 16px; padding: 44px 24px 32px; }
}
@media (prefers-reduced-motion: reduce) {
    .hb-orb, .hb-card { animation: none !important; }
}
`;

export default function Login() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        googleProvider.setCustomParameters({ hd: ALLOWED_DOMAIN });

        try {
            const result = await signInWithPopup(auth, googleProvider);

            if (!result.user.email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
                await auth.signOut();
                setError(`Access restricted. Please login using your @${ALLOWED_DOMAIN} email.`);
                setLoading(false);
                return;
            }
            navigate('/dashboard');
        } catch (err) {
            if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
                setError('Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hb-root">
            <style>{css}</style>

            <div className="hb-bg">
                <div className="hb-grid" />
                <div className="hb-orb a" />
                <div className="hb-orb b" />
                <div className="hb-orb c" />
            </div>

            <div className="hb-card">
                <div className="hb-logo">HB</div>

                <p className="hb-lead">Sign in with your work account to continue to your dashboard.</p>

                {error && <div className="hb-error" role="alert">{error}</div>}

                <button onClick={handleGoogleLogin} disabled={loading} className="hb-btn">
                    {loading ? <span className="hb-spinner" /> : <GoogleIcon />}
                    <span>{loading ? 'Verifying domain...' : 'Continue with Google'}</span>
                </button>

                <div className="hb-divider">secure access</div>

                <div className="hb-note">
                    <ShieldIcon />
                    <span>Restricted to <strong>@{ALLOWED_DOMAIN}</strong> accounts only</span>
                </div>
            </div>
        </div>
    );
}