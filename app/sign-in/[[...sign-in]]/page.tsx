import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-4">
              <span className="text-orange-400 text-sm">🔥</span>
              <span className="text-orange-400 text-sm font-medium">Join 10,000+ automation experts</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent mb-3">
            {process.env.NEXT_PUBLIC_APP_NAME || 'n8n-store'}
          </h1>
          <h2 className="text-xl font-semibold text-white mb-2">
            Master n8n Automation
          </h2>
          <p className="text-gray-300 text-sm mb-4">
            Access 500+ workflows • Build faster • Automate everything
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>⚡ 10min setup</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>🎯 94% success rate</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>🏆 Expert community</span>
            </div>
          </div>
        </div>

        <SignIn
          appearance={{
            elements: {
              card: {
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                padding: '2rem',
              },
              headerTitle: {
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: '700',
                textAlign: 'center',
              },
              headerSubtitle: {
                color: '#d1d5db',
                fontSize: '0.875rem',
                textAlign: 'center',
              },
              formFieldLabel: {
                color: '#f9fafb',
                fontSize: '0.875rem',
                fontWeight: '600',
              },
              formFieldInput: {
                backgroundColor: '#374151',
                border: '2px solid #4b5563',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.875rem',
                padding: '0.75rem',
                height: '2.5rem',
                '&:focus': {
                  borderColor: '#f97316',
                  boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.2)',
                },
                '&::placeholder': {
                  color: '#9ca3af',
                },
              },
              
              // Password field toggle button (eye icon)
              formFieldInputShowPasswordButton: {
                color: '#ffffff !important',
                backgroundColor: 'transparent !important',
                border: 'none !important',
                padding: '0.5rem !important',
                '&:hover': {
                  color: '#f97316 !important',
                  backgroundColor: 'rgba(249, 115, 22, 0.1) !important',
                },
                '&:focus': {
                  color: '#f97316 !important',
                  outline: 'none !important',
                },
              },
              
              // Alternative selector for password toggle
              passwordInputShowPasswordButton: {
                color: '#ffffff !important',
                backgroundColor: 'transparent !important',
                '&:hover': {
                  color: '#f97316 !important',
                },
              },
              formButtonPrimary: {
                backgroundColor: '#f97316 !important',
                color: '#000000 !important',
                fontWeight: '700 !important',
                fontSize: '0.875rem !important',
                height: '2.5rem',
                borderRadius: '6px',
                border: 'none !important',
                textTransform: 'none !important',
                '&:hover': {
                  backgroundColor: '#ea580c !important',
                  color: '#000000 !important',
                },
                '&:focus': {
                  backgroundColor: '#f97316 !important',
                  color: '#000000 !important',
                },
                '&:active': {
                  backgroundColor: '#f97316 !important',
                  color: '#000000 !important',
                },
              },
              socialButtonsBlockButton: {
                backgroundColor: '#374151',
                color: '#ffffff',
                border: '2px solid #4b5563',
                borderRadius: '6px',
                height: '2.5rem',
                '&:hover': {
                  backgroundColor: '#4b5563',
                },
              },
              footerActionText: {
                color: '#d1d5db',
              },
              footerActionLink: {
                color: '#f97316',
              },
            },
          }}
        />
      </div>
    </div>
  )
}