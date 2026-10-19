#import "NativekitView.h"

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

@interface NativekitView () <RCTNativekitViewViewProtocol>
@end

@implementation NativekitView {
  NativekitHostingView *_hostingView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NativekitViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const NativekitViewProps>();
    _props = defaultProps;

    _hostingView = [NativekitHostingView new];
    __weak __typeof(self) weakSelf = self;
    _hostingView.onPress = ^{
      __typeof(self) strongSelf = weakSelf;
      if (strongSelf && strongSelf->_eventEmitter) {
        std::static_pointer_cast<const NativekitViewEventEmitter>(strongSelf->_eventEmitter)
            ->onButtonPress(NativekitViewEventEmitter::OnButtonPress{});
      }
    };

    self.contentView = _hostingView.view;
  }
  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<NativekitViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<NativekitViewProps const>(props);

  if (oldViewProps.title != newViewProps.title) {
    _hostingView.title = [NSString stringWithUTF8String:newViewProps.title.c_str()];
  }

  [super updateProps:props oldProps:oldProps];
}

@end

Class<RCTComponentViewProtocol> NativekitViewCls(void)
{
  return NativekitView.class;
}
