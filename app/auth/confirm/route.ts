import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * This route is used to confirm a user's email or password reset token.
 * It uses the token_hash and type to verify the OTP and then redirects
 * to the specified 'next' page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  redirectTo.searchParams.delete('next')

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // If we are resetting password, we must redirect to /reset-password
      // This is handled by the ?next=... parameter in the link we generate
      return NextResponse.redirect(redirectTo)
    }
    
    console.error("OTP Verification Error:", error.message)
    // Redirect to sign-in with error message
    const errorRedirect = request.nextUrl.clone()
    errorRedirect.pathname = '/sign-in'
    errorRedirect.searchParams.set('error', 'Token is invalid or has expired.')
    return NextResponse.redirect(errorRedirect)
  }

  // Fallback to home or sign-in
  const fallbackRedirect = request.nextUrl.clone()
  fallbackRedirect.pathname = '/sign-in'
  return NextResponse.redirect(fallbackRedirect)
}
