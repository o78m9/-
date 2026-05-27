'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center"
          >
            <p className="text-mute text-sm">حدث خطأ غير متوقع. يرجى تحديث الصفحة.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 text-xs text-forest underline hover:no-underline"
            >
              حاول مجدداً
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
