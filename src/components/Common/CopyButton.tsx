import { Copy, Check } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/useClipboard'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function CopyButton({ text, size = 'icon' }: CopyButtonProps) {
  const { copy, copied } = useClipboard()
  const disabled = !text

  const handleCopy = () => {
    if (text) copy(text)
  }

  const label = disabled
    ? 'Nada para copiar'
    : copied
      ? 'Copiado!'
      : 'Copiar para a área de transferência'

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              variant="ghost"
              size={size}
              disabled={disabled}
              onClick={handleCopy}
              aria-label={label}
              className={cn(copied && 'text-green-600 dark:text-green-400')}
            >
              <span key={copied ? 'check' : 'copy'} className="animate-icon-blur inline-flex">
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </span>
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
