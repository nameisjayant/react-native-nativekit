#import "NativeKitBottomSheet.h"

#import <React/RCTConversions.h>
#import <React/RCTSurfaceTouchHandler.h>

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

static NSString *NativeKitBottomSheetString(const std::string &value)
{
  return [NSString stringWithUTF8String:value.c_str()];
}

@interface NativeKitBottomSheet () <RCTNativeKitBottomSheetViewProtocol>
@end

/**
 * Fabric host of a bottom sheet. It never shows anything itself: React children mounted into it
 * are moved into the presenter's content view, which is shown inside a UIKit sheet. The host's
 * Yoga frame is only used as the size of that content.
 */
@implementation NativeKitBottomSheet {
  NativeKitBottomSheetPresenter *_presenter;
  // The sheet lives outside the React surface, so it needs its own touch handler (like RN's Modal).
  RCTSurfaceTouchHandler *_touchHandler;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<NativeKitBottomSheetComponentDescriptor>();
}

// A recycled view would carry a live presentation over to another sheet.
+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const NativeKitBottomSheetProps>();
    _props = defaultProps;

    _presenter = [NativeKitBottomSheetPresenter new];
    _presenter.hostView = self;

    _touchHandler = [RCTSurfaceTouchHandler new];
    [_touchHandler attachToView:_presenter.contentView];

    __weak __typeof(self) weakSelf = self;
    _presenter.onDismiss = ^{
      if (auto emitter = [weakSelf sheetEventEmitter]) {
        emitter->onSheetDismiss(NativeKitBottomSheetEventEmitter::OnSheetDismiss{});
      }
    };
    _presenter.onStateChange = ^(NSString *state) {
      if (auto emitter = [weakSelf sheetEventEmitter]) {
        emitter->onSheetStateChange(NativeKitBottomSheetEventEmitter::OnSheetStateChange{
            .state = std::string(state.UTF8String)});
      }
    };
    _presenter.onActionPress = ^(NSInteger index) {
      if (auto emitter = [weakSelf sheetEventEmitter]) {
        emitter->onActionPress(NativeKitBottomSheetEventEmitter::OnActionPress{.index = (int)index});
      }
    };
    _presenter.onLayout = ^(CGSize size) {
      if (auto emitter = [weakSelf sheetEventEmitter]) {
        emitter->onSheetLayout(NativeKitBottomSheetEventEmitter::OnSheetLayout{
            .width = (Float)size.width, .height = (Float)size.height});
      }
    };
  }
  return self;
}

- (std::shared_ptr<const NativeKitBottomSheetEventEmitter>)sheetEventEmitter
{
  if (!_eventEmitter) {
    return nullptr;
  }
  return std::static_pointer_cast<const NativeKitBottomSheetEventEmitter>(_eventEmitter);
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_presenter.contentView insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<NativeKitBottomSheetProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<NativeKitBottomSheetProps const>(props);

  if (oldViewProps.variant != newViewProps.variant) {
    _presenter.variant = NativeKitBottomSheetString(toString(newViewProps.variant));
  }
  if (oldViewProps.dismissible != newViewProps.dismissible) {
    _presenter.dismissible = newViewProps.dismissible;
  }
  if (oldViewProps.showDragHandle != newViewProps.showDragHandle) {
    _presenter.showDragHandle = newViewProps.showDragHandle;
  }
  if (oldViewProps.cornerRadius != newViewProps.cornerRadius) {
    _presenter.cornerRadius = newViewProps.cornerRadius;
  }
  if (oldViewProps.sheetBackgroundColor != newViewProps.sheetBackgroundColor) {
    _presenter.sheetBackgroundColor = RCTUIColorFromSharedColor(newViewProps.sheetBackgroundColor);
  }
  if (oldViewProps.peekHeight != newViewProps.peekHeight) {
    _presenter.peekHeight = newViewProps.peekHeight;
  }
  if (oldViewProps.title != newViewProps.title) {
    _presenter.title = NativeKitBottomSheetString(newViewProps.title);
  }
  if (oldViewProps.message != newViewProps.message) {
    _presenter.message = NativeKitBottomSheetString(newViewProps.message);
  }
  // Always forwarded: the generated action struct isn't comparable, and the list is tiny.
  {
    NSMutableArray<NSString *> *titles = [NSMutableArray new];
    NSMutableArray<NSString *> *roles = [NSMutableArray new];
    NSMutableArray<NSNumber *> *disabled = [NSMutableArray new];
    for (const auto &action : newViewProps.actions) {
      [titles addObject:NativeKitBottomSheetString(action.title)];
      [roles addObject:NativeKitBottomSheetString(action.role)];
      [disabled addObject:@(action.disabled)];
    }
    [_presenter setActionsWithTitles:titles roles:roles disabled:disabled];
  }
  // Last, so a sheet shown by this update already has the new configuration.
  if (oldViewProps.visible != newViewProps.visible) {
    _presenter.visible = newViewProps.visible;
  }

  [super updateProps:props oldProps:oldProps];
  [_presenter update];
}

- (void)updateLayoutMetrics:(LayoutMetrics const &)layoutMetrics
           oldLayoutMetrics:(LayoutMetrics const &)oldLayoutMetrics
{
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
  _presenter.contentSize = RCTCGSizeFromSize(layoutMetrics.frame.size);
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  // A sheet made visible before the host was in a window can be presented now.
  if (self.window) {
    [_presenter update];
  }
}

// The host's own frame must never swallow touches meant for the views under it.
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  return nil;
}

- (void)invalidate
{
  [_presenter invalidate];
  [_touchHandler detachFromView:_presenter.contentView];
  [super invalidate];
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  [_presenter invalidate];
}

@end

Class<RCTComponentViewProtocol> NativeKitBottomSheetCls(void)
{
  return NativeKitBottomSheet.class;
}
