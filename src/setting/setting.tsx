/** @jsx jsx */
import { React, jsx, type AllWidgetSettingProps, getAppStore } from 'jimu-core'
import { NumericInput, Label, Select } from 'jimu-ui'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { ThemeColorPicker } from 'jimu-ui/basic/color-picker'
import { type IMConfig } from '../runtime/config'
import defaultMessages from './translations/default'

export default class Setting extends React.PureComponent<AllWidgetSettingProps<IMConfig>, unknown> {
  onConfigChange = (key: string, value: any): void => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(key, value)
    })
  }

  render(): React.ReactElement {
    const { config, intl } = this.props
    const state = getAppStore().getState()
    const widgets = Object.values(state?.appStateInBuilder?.appConfig?.widgets?.asMutable({ deep: true }) ?? {})
      .filter((w: any) => w.id !== this.props.id)
    const numericBoxStyle = { width: '80px', flexShrink: 0 }

    const svgCodeBoxStyle = {
      width: '100%',
      minHeight: '200px',
      resize: 'vertical' as const,
      color: '#ffffff',
      backgroundColor: '#282828',
      border: '1px solid #555555',
      borderRadius: '2px',
      padding: '8px',
      fontFamily: 'monospace'
    }

    const horizontalRowStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    }

    return (
      <div className="jimu-widget-setting">
        <SettingSection title={intl.formatMessage({ id: 'svgCode', defaultMessage: defaultMessages.svgCode })}>
          <textarea
            style={svgCodeBoxStyle}
            value={config.svgCode}
            onChange={(e) => { this.onConfigChange('svgCode', e.target.value) }}
            placeholder={intl.formatMessage({ id: 'svgCodePlaceholder', defaultMessage: defaultMessages.svgCodePlaceholder })}
          />
        </SettingSection>

        <SettingSection title={intl.formatMessage({ id: 'iconStyling', defaultMessage: defaultMessages.iconStyling })}>
          <div style={horizontalRowStyle}>
            <Label>{intl.formatMessage({ id: 'iconAlignment', defaultMessage: defaultMessages.iconAlignment })}</Label>
            <Select
              style={{ width: '130px' }}
              value={config.iconAlignment}
              onChange={(e) => { this.onConfigChange('iconAlignment', e.target.value) }}
            >
              <option value="top-left">{intl.formatMessage({ id: 'alignTopLeft', defaultMessage: defaultMessages.alignTopLeft })}</option>
              <option value="top-center">{intl.formatMessage({ id: 'alignTopCenter', defaultMessage: defaultMessages.alignTopCenter })}</option>
              <option value="top-right">{intl.formatMessage({ id: 'alignTopRight', defaultMessage: defaultMessages.alignTopRight })}</option>
              <option value="center-left">{intl.formatMessage({ id: 'alignCenterLeft', defaultMessage: defaultMessages.alignCenterLeft })}</option>
              <option value="center">{intl.formatMessage({ id: 'alignCenter', defaultMessage: defaultMessages.alignCenter })}</option>
              <option value="center-right">{intl.formatMessage({ id: 'alignCenterRight', defaultMessage: defaultMessages.alignCenterRight })}</option>
              <option value="bottom-left">{intl.formatMessage({ id: 'alignBottomLeft', defaultMessage: defaultMessages.alignBottomLeft })}</option>
              <option value="bottom-center">{intl.formatMessage({ id: 'alignBottomCenter', defaultMessage: defaultMessages.alignBottomCenter })}</option>
              <option value="bottom-right">{intl.formatMessage({ id: 'alignBottomRight', defaultMessage: defaultMessages.alignBottomRight })}</option>
            </Select>
          </div>

          <SettingRow label={intl.formatMessage({ id: 'iconColor', defaultMessage: defaultMessages.iconColor })}>
            <ThemeColorPicker value={config.iconColor} onChange={(color) => { this.onConfigChange('iconColor', color) }} />
          </SettingRow>

          <SettingRow label={intl.formatMessage({ id: 'strokeColor', defaultMessage: defaultMessages.strokeColor })}>
            <ThemeColorPicker value={config.strokeColor} onChange={(color) => { this.onConfigChange('strokeColor', color) }} />
          </SettingRow>

          <div style={horizontalRowStyle}>
            <Label>{intl.formatMessage({ id: 'strokeWidth', defaultMessage: defaultMessages.strokeWidth })}</Label>
            <NumericInput style={numericBoxStyle} value={config.strokeWidth} onAcceptValue={(value) => { this.onConfigChange('strokeWidth', value) }} min={0} step={1} showHandlers={false} suffix="px" />
          </div>
        </SettingSection>

        <SettingSection title={intl.formatMessage({ id: 'containerStyle', defaultMessage: defaultMessages.containerStyle })}>
          <SettingRow label={intl.formatMessage({ id: 'defaultColor', defaultMessage: defaultMessages.defaultColor })}>
            <ThemeColorPicker value={config.backgroundColor} onChange={(color) => { this.onConfigChange('backgroundColor', color) }} />
          </SettingRow>
          <div style={horizontalRowStyle}>
            <Label>{intl.formatMessage({ id: 'padding', defaultMessage: defaultMessages.padding })}</Label>
            <NumericInput style={numericBoxStyle} value={config.padding} onAcceptValue={(value) => { this.onConfigChange('padding', value) }} min={0} step={1} showHandlers={false} suffix="px" />
          </div>
          <div style={horizontalRowStyle}>
            <Label>{intl.formatMessage({ id: 'margin', defaultMessage: defaultMessages.margin })}</Label>
            <NumericInput style={numericBoxStyle} value={config.margin} onAcceptValue={(value) => { this.onConfigChange('margin', value) }} min={0} step={1} showHandlers={false} suffix="px" />
          </div>
          <div style={horizontalRowStyle}>
            <Label>{intl.formatMessage({ id: 'borderRadius', defaultMessage: defaultMessages.borderRadius })}</Label>
            <NumericInput style={numericBoxStyle} value={config.borderRadius} onAcceptValue={(value) => { this.onConfigChange('borderRadius', value) }} min={0} step={1} showHandlers={false} suffix="px" />
          </div>
        </SettingSection>

        <SettingSection title={intl.formatMessage({ id: 'dataConnection', defaultMessage: defaultMessages.dataConnection })}>
          <SettingRow label={intl.formatMessage({ id: 'sourceWidget', defaultMessage: defaultMessages.sourceWidget })}>
            <Select
              style={{ width: '130px' }}
              value={config.sourceWidgetId}
              onChange={(e) => { this.onConfigChange('sourceWidgetId', e.target.value) }}
            >
              <option value="">
                {intl.formatMessage({ id: 'selectWidget', defaultMessage: defaultMessages.selectWidget })}
              </option>
              {widgets.map((w: any) => (
                <option key={w.id} value={w.id}>{w.label ?? w.name ?? w.id}</option>
              ))}
            </Select>
          </SettingRow>
          <SettingRow label={intl.formatMessage({ id: 'optimalThreshold', defaultMessage: defaultMessages.optimalThreshold })}>
            <NumericInput style={numericBoxStyle} value={config.optimalThreshold} onAcceptValue={(value) => { this.onConfigChange('optimalThreshold', value) }} min={0} step={0.1} showHandlers={false} />
          </SettingRow>
          <SettingRow label={intl.formatMessage({ id: 'marginalThreshold', defaultMessage: defaultMessages.marginalThreshold })}>
            <NumericInput style={numericBoxStyle} value={config.marginalThreshold} onAcceptValue={(value) => { this.onConfigChange('marginalThreshold', value) }} min={0} step={0.1} showHandlers={false} />
          </SettingRow>
          <SettingRow label={intl.formatMessage({ id: 'criticalThreshold', defaultMessage: defaultMessages.criticalThreshold })}>
            <NumericInput style={numericBoxStyle} value={config.criticalThreshold} onAcceptValue={(value) => { this.onConfigChange('criticalThreshold', value) }} min={0} step={0.1} showHandlers={false} />
          </SettingRow>
          <SettingRow label={intl.formatMessage({ id: 'optimalColor', defaultMessage: defaultMessages.optimalColor })}>
            <ThemeColorPicker value={config.optimalColor} onChange={(color) => { this.onConfigChange('optimalColor', color) }} />
          </SettingRow>
          <SettingRow label={intl.formatMessage({ id: 'marginalColor', defaultMessage: defaultMessages.marginalColor })}>
            <ThemeColorPicker value={config.marginalColor} onChange={(color) => { this.onConfigChange('marginalColor', color) }} />
          </SettingRow>
          <SettingRow label={intl.formatMessage({ id: 'criticalColor', defaultMessage: defaultMessages.criticalColor })}>
            <ThemeColorPicker value={config.criticalColor} onChange={(color) => { this.onConfigChange('criticalColor', color) }} />
          </SettingRow>
        </SettingSection>

        <SettingSection title={intl.formatMessage({ id: 'iconBoxSize', defaultMessage: defaultMessages.iconBoxSize })}>
          <div style={horizontalRowStyle}>
            <Label>{intl.formatMessage({ id: 'width', defaultMessage: defaultMessages.width })}</Label>
            <NumericInput style={numericBoxStyle} value={config.iconWidth} onAcceptValue={(value) => { this.onConfigChange('iconWidth', value) }} min={1} step={1} showHandlers={false} suffix="px" />
          </div>
          <div style={horizontalRowStyle}>
            <Label>{intl.formatMessage({ id: 'height', defaultMessage: defaultMessages.height })}</Label>
            <NumericInput style={numericBoxStyle} value={config.iconHeight} onAcceptValue={(value) => { this.onConfigChange('iconHeight', value) }} min={1} step={1} showHandlers={false} suffix="px" />
          </div>
        </SettingSection>
      </div>
    )
  }
}