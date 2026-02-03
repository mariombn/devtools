import { RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/Common/CopyButton'

interface GeneratorCardProps {
  title: string
  value: string
  onGenerate: () => void
  icon?: React.ReactNode
}

export function GeneratorCard({
  title,
  value,
  onGenerate,
  icon,
}: GeneratorCardProps) {
  return (
    <Card>
      <CardContent className="pt-5 sm:pt-6">
        <div className="mb-4 flex items-center gap-3">
          {icon && (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
              {icon}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate font-medium text-foreground">{title}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 group"
            onClick={onGenerate}
            aria-label="Gerar novo"
          >
            <RefreshCw className="size-4 group-hover:rotate-90 transition-transform duration-200 ease-in-out" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={value}
            className="font-mono text-sm"
          />
          <CopyButton text={value} size="icon" />
        </div>
      </CardContent>
    </Card>
  )
}
