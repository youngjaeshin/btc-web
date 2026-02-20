"use client";

import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class PlotErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("[PlotErrorBoundary] Render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              차트를 불러올 수 없습니다. 페이지를 새로고침해 주세요.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
