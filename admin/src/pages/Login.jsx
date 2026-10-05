import { useState } from 'react'
import { Gem, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

/**
 * Login – branded admin login page for Looking Elegant.
 * Uses Supabase email + password auth.
 */
export default function Login({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSignIn(email, password)
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] px-4">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            var(--gold-primary) 0px,
            var(--gold-primary) 1px,
            transparent 1px,
            transparent 12px
          )`,
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="glass-card p-8 space-y-7">
          {/* Brand header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9a97a] to-[#b8935a] flex items-center justify-center shadow-lg">
                <Gem size={24} className="text-white" />
              </div>
            </div>
            <div>
              <div className="gold-divider mx-auto" style={{ width: '40px' }} />
              <h1 className="font-editorial text-[var(--text-main)] text-2xl font-light tracking-wide mt-2">
                Looking Elegant
              </h1>
              <p className="text-[var(--gold-text)] text-[0.6rem] tracking-widest uppercase font-bold mt-0.5">
                Inventory Central
              </p>
            </div>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed">
              Sign in to access the boutique admin dashboard
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-3.5 py-3">
              <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-[0.78rem] leading-snug">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="field-label">Email</label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="owner@lookingelg.rw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="field-label">Password</label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="btn-gold w-full justify-center mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[var(--text-subtle)] text-[0.68rem] leading-relaxed">
            Access restricted to boutique staff only.
            <br />
            Contact your administrator if you need access.
          </p>
        </div>

        {/* Version stamp */}
        <p className="text-center text-[var(--text-subtle)] text-[0.62rem] mt-4 tracking-widest uppercase">
          Looking Elegant · Admin v2.0
        </p>
      </div>
    </div>
  )
}
