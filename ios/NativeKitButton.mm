#import "NativeKitButton.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/ReactNativeNativekitSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNativeNativekitSpec/EventEmitters.h>
#import <react/renderer/components/ReactNativeNativekitSpec/Props.h>
#import <react/renderer/components/ReactNativeNativekitSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#if __has_include(<ReactNativeNativekit/ReactNativeNativekit-Swift.h>)
#import <ReactNativeNativekit/ReactNativeNativekit-Swift.h>
#else
#import "ReactNativeNativekit-Swift.h"
#endif

using namespace facebook::react;

static NSString *NativeKitButtonString(const std::string &value)
{
  return [NSString stringWithUTF8String:value.c_str()];
}

@interface NativeKitButton () <RCTNativeKitButtonViewProtocol>
@end

@implementation NativeKitButton {
  NativeKitButtonHostingView *_hostingView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NativeKitButtonComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const NativeKitButtonProps>();
    _props = defaultProps;

    _hostingView = [NativeKitButtonHostingView new];
    __weak __typeof(self) weakSelf = self;
    _hostingView.onPress = ^{
      __typeof(self) strongSelf = weakSelf;
      if (strongSelf && strongSelf->_eventEmitter) {
        std::static_pointer_cast<const NativeKitButtonEventEmitter>(strongSelf->_eventEmitter)
            ->onButtonPress(NativeKitButtonEventEmitter::OnButtonPress{});
      }
    };

    self.contentView = _hostingView.view;
  }
  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<NativeKitButtonProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<NativeKitButtonProps const>(props);

  if (oldViewProps.title != newViewProps.title) {
    _hostingView.title = NativeKitButtonString(newViewProps.title);
  }
  if (oldViewProps.variant != newViewProps.variant) {
    _hostingView.variant = NativeKitButtonString(toString(newViewProps.variant));
  }
  if (oldViewProps.size != newViewProps.size) {
    _hostingView.size = NativeKitButtonString(toString(newViewProps.size));
  }
  if (oldViewProps.color != newViewProps.color) {
    _hostingView.color = RCTUIColorFromSharedColor(newViewProps.color);
  }
  if (oldViewProps.textColor != newViewProps.textColor) {
    _hostingView.textColor = RCTUIColorFromSharedColor(newViewProps.textColor);
  }
  if (oldViewProps.disabled != newViewProps.disabled) {
    _hostingView.disabled = newViewProps.disabled;
  }
  if (oldViewProps.loading != newViewProps.loading) {
    _hostingView.loading = newViewProps.loading;
  }
  if (oldViewProps.cornerRadius != newViewProps.cornerRadius) {
    _hostingView.cornerRadius = newViewProps.cornerRadius;
  }
  if (oldViewProps.fontSize != newViewProps.fontSize) {
    _hostingView.fontSize = newViewProps.fontSize;
  }
  if (oldViewProps.fontWeight != newViewProps.fontWeight) {
    _hostingView.fontWeight = NativeKitButtonString(toString(newViewProps.fontWeight));
  }

  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> NativeKitButtonCls(void)
{
  return NativeKitButton.class;
}
