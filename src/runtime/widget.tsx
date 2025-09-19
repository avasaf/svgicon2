/** @jsx jsx */
import { React, AllWidgetProps, jsx, css, type SerializedStyles } from 'jimu-core'
import { type IMConfig } from './config'

type State = {
  iconSize: number
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, State> {
  pollingInterval?: number
  resizeObserver?: ResizeObserver
  widgetRef = React.createRef<HTMLDivElement>()

  state: State = {
    iconSize: this.getBaseIconSize(this.props.config)
  }

  getBaseIconSize = (config: IMConfig): number => {
    const width = config.iconWidth ?? config.iconHeight ?? 50
    const height = config.iconHeight ?? config.iconWidth ?? 50
    const baseSize = Math.max(Math.min(width, height), 1)
    return baseSize
  }

  getAlignmentStyles = (alignment: string): { justifyContent: string, alignItems: string } => {
    if (!alignment || alignment === 'center') {
      return { justifyContent: 'center', alignItems: 'center' }
    }
    const [vertical, horizontal] = alignment.split('-')
    const justifyContentMap: { [key: string]: string } = { left: 'flex-start', center: 'center', right: 'flex-end' }
    const alignItemsMap: { [key: string]: string } = { top: 'flex-start', center: 'center', bottom: 'flex-end' }
    return {
      justifyContent: justifyContentMap[horizontal] ?? 'center',
      alignItems: alignItemsMap[vertical] ?? 'center'
    }
  }

  componentDidMount (): void {
    this.startPolling()
    this.startResizeObserver()
    this.updateResponsiveSize()
  }

  componentDidUpdate (prevProps: AllWidgetProps<IMConfig>): void {
    if (prevProps.config.sourceWidgetId !== this.props.config.sourceWidgetId) {
      this.startPolling()
    }

    if (prevProps.config !== this.props.config) {
      this.updateResponsiveSize()
    }
  }

  componentWillUnmount (): void {
    if (this.pollingInterval) {
      window.clearInterval(this.pollingInterval)
    }

    if (this.resizeObserver && this.widgetRef.current) {
      this.resizeObserver.unobserve(this.widgetRef.current)
    }
    this.resizeObserver?.disconnect()
  }

  startPolling = (): void => {
    if (this.pollingInterval) {
      window.clearInterval(this.pollingInterval)
    }

    if (this.props.config.sourceWidgetId) {
      this.updateBackground()
      this.pollingInterval = window.setInterval(this.updateBackground, 1000)
    }
  }

  updateBackground = (): void => {
    const { config, id } = this.props
    const sourceId = config.sourceWidgetId
    if (!sourceId) return

    const sourceNode = document.querySelector(`[data-widgetid="${sourceId}"]`)
    const targetNode = document.querySelector(`[data-widgetid="${id}"] .icon-box`) as HTMLElement
    if (!sourceNode || !targetNode) return

    const textValue = parseFloat(sourceNode.textContent ?? '')
    let bg = config.backgroundColor ?? 'gray'

    if (!isNaN(textValue)) {
      const optimal = config.optimalThreshold ?? 0
      const marginal = config.marginalThreshold ?? optimal
      const critical = config.criticalThreshold ?? marginal
      const optimalColor = config.optimalColor ?? 'green'
      const marginalColor = config.marginalColor ?? 'orange'
      const criticalColor = config.criticalColor ?? 'red'

      if (textValue <= optimal) {
        bg = optimalColor
      } else if (textValue <= marginal) {
        bg = marginalColor
      } else if (textValue <= critical) {
        bg = criticalColor
      } else {
        bg = criticalColor
      }
    }

    targetNode.style.backgroundColor = bg
  }

  startResizeObserver = (): void => {
    if (!this.widgetRef.current) {
      return
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updateResponsiveSize()
    })
    this.resizeObserver.observe(this.widgetRef.current)
  }

  updateResponsiveSize = (): void => {
    const container = this.widgetRef.current
    if (!container) {
      return
    }

    const { config } = this.props
    const rect = container.getBoundingClientRect()
    const padding = config.padding ?? 0
    const availableWidth = Math.max(rect.width - padding * 2, 0)
    const availableHeight = Math.max(rect.height - padding * 2, 0)
    const fallbackSize = this.getBaseIconSize(config)
    const hasSpace = availableWidth > 0 && availableHeight > 0
    const nextSize = hasSpace ? Math.min(availableWidth, availableHeight) : fallbackSize

    if (Math.abs(this.state.iconSize - nextSize) > 0.5) {
      this.setState({ iconSize: nextSize })
    }
  }

  getStyle = (): SerializedStyles => {
    const { config } = this.props
    const iconAlignment = config.iconAlignment ?? 'center'
    const { justifyContent, alignItems } = this.getAlignmentStyles(iconAlignment)
    const iconSize = this.state.iconSize

    return css`
      & {
        width: 100%;
        height: 100%;
        margin: ${config.margin ?? 0}px;
        overflow: hidden;

        display: flex;
        align-items: ${alignItems};
        justify-content: ${justifyContent};
      }

      .icon-box {
        width: ${iconSize}px;
        height: ${iconSize}px;
        background-color: ${config.backgroundColor ?? 'transparent'};
        padding: ${config.padding ?? 0}px;
        border-radius: ${config.borderRadius ?? 0}px;

        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 100%;
        max-height: 100%;
        aspect-ratio: 1 / 1;
      }

      .icon-box svg {
        max-width: 100%;
        max-height: 100%;
        display: block;
        fill: ${config.iconColor ?? '#000000'};
        stroke: ${config.strokeColor ?? 'none'};
        stroke-width: ${config.strokeWidth ?? 0}px;
      }
    `
  }

  render(): React.ReactElement {
    const { config, id } = this.props
    const svgCode = config.svgCode ?? '<svg viewBox="0 0 16 16"></svg>'
    return (
      <div
        className={`svg-icon-widget widget-${id}`}
        css={this.getStyle()}
        ref={this.widgetRef}
        title="Custom SVG Icon"
      >
        <div
          className="icon-box"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>
    )
  }
}