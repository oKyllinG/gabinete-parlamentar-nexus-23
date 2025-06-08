
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface BriefingSectionProps {
  title: string
  children: ReactNode
  headerActions?: ReactNode
  className?: string
}

export const BriefingSection = ({ title, children, headerActions, className = "" }: BriefingSectionProps) => {
  return (
    <Card className={`shadow-sm border-l-4 border-l-primary/20 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-primary rounded-full"></span>
            {title}
          </CardTitle>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  )
}
