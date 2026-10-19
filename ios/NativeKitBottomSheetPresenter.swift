import UIKit

/// Presents the React content of a `NativeKitBottomSheet` with UIKit's sheet APIs
/// (`UISheetPresentationController`, `UIAlertController` for action sheets).
///
/// UIKit, not SwiftUI, because the sheet hosts React Native views (themselves UIKit views) and is
/// presented from a Fabric component; SwiftUI's `.sheet` / `presentationDetents` wrap these same
/// UIKit controllers.
@objc(NativeKitBottomSheetPresenter)
public final class NativeKitBottomSheetPresenter: NSObject {
  // MARK: Props

  @objc public var visible = false {
    didSet {
      // A user dismissal stays dismissed until JS hides and shows the sheet again.
      if !visible { dismissedByUser = false }
    }
  }
  @objc public var variant = "modal"
  @objc public var dismissible = true
  @objc public var showDragHandle = true
  @objc public var cornerRadius: CGFloat = -1
  @objc public var sheetBackgroundColor: UIColor?
  @objc public var peekHeight: CGFloat = 0
  @objc public var title = ""
  @objc public var message = ""
  private var actions: [SheetAction] = []

  /// Size of the React content: the Fabric host's frame.
  @objc public var contentSize: CGSize = .zero {
    didSet {
      guard contentSize != oldValue else { return }
      sheetController?.setContentSize(contentSize)
      if #available(iOS 16.0, *), let sheet = sheetController?.sheetPresentationController {
        // Content-fit detents follow the content height.
        sheet.animateChanges { sheet.invalidateDetents() }
      }
    }
  }

  // MARK: Events

  @objc public var onDismiss: (() -> Void)?
  @objc public var onStateChange: ((String) -> Void)?
  @objc public var onActionPress: ((Int) -> Void)?
  @objc public var onLayout: ((CGSize) -> Void)?

  // MARK: Hosting

  /// Receives the React children; the Fabric host moves them in here.
  @objc public let contentView: UIView = {
    let view = UIView()
    view.backgroundColor = .clear
    return view
  }()

  /// The Fabric host view, used to find the window to present from.
  @objc public weak var hostView: UIView?

  private var sheetController: NativeKitSheetViewController?
  private var alertController: UIAlertController?
  private var isTransitioning = false
  private var dismissedByUser = false
  private var lastReportedLayout: CGSize?

  private var presentedController: UIViewController? { sheetController ?? alertController }

  @objc public func setActions(titles: [String], roles: [String], disabled: [Bool]) {
    actions = titles.indices.map { index in
      SheetAction(
        title: titles[index],
        role: index < roles.count ? roles[index] : "default",
        disabled: index < disabled.count ? disabled[index] : false
      )
    }
  }

  /// Applies the latest props: presents, dismisses or reconfigures the sheet.
  @objc public func update() {
    if let sheetController {
      sheetController.view.backgroundColor = sheetBackgroundColor ?? .systemBackground
      sheetController.topInset = topInset
      if let sheet = sheetController.sheetPresentationController {
        sheet.animateChanges { configure(sheet) }
      }
      sheetController.isModalInPresentation = !isUserDismissible
    }
    sync()
  }

  /// Tears the sheet down without animating, e.g. when the React view is removed.
  @objc public func invalidate() {
    visible = false
    presentedController?.presentingViewController?.dismiss(animated: false)
    sheetController = nil
    alertController = nil
    isTransitioning = false
  }

  // MARK: Presentation

  private var isUserDismissible: Bool {
    switch variant {
    case "persistent": return false
    case "fullScreen": return false // A full-screen cover has no swipe-to-dismiss.
    default: return dismissible
    }
  }

  private func sync() {
    guard !isTransitioning else { return }
    if visible && !dismissedByUser && presentedController == nil {
      present()
    } else if !visible, let controller = presentedController {
      dismiss(controller)
    }
  }

  private func present() {
    guard let presenter = topViewController() else { return }
    let controller: UIViewController
    if variant == "actionSheet" {
      let alert = makeActionSheet()
      alertController = alert
      controller = alert
    } else {
      let sheet = makeSheet()
      sheetController = sheet
      controller = sheet
    }

    isTransitioning = true
    presenter.present(controller, animated: true) { [weak self] in
      guard let self else { return }
      self.isTransitioning = false
      if self.sheetController === controller {
        self.onStateChange?(self.currentStateName())
      }
      self.sync()
    }
  }

  private func dismiss(_ controller: UIViewController) {
    isTransitioning = true
    controller.presentingViewController?.dismiss(animated: true) { [weak self] in
      self?.didDismiss(controller, userInitiated: false)
    }
    if controller.presentingViewController == nil {
      didDismiss(controller, userInitiated: false)
    }
  }

  private func didDismiss(_ controller: UIViewController, userInitiated: Bool) {
    guard controller === presentedController else { return }
    sheetController = nil
    alertController = nil
    isTransitioning = false
    if userInitiated { dismissedByUser = true }
    onStateChange?("hidden")
    if userInitiated { onDismiss?() }
    sync()
  }

  private func makeSheet() -> NativeKitSheetViewController {
    let controller = NativeKitSheetViewController(contentView: contentView)
    controller.view.backgroundColor = sheetBackgroundColor ?? .systemBackground
    controller.setContentSize(contentSize)
    controller.topInset = topInset
    controller.usesFitDetent = usesFitDetent
    controller.isModalInPresentation = !isUserDismissible
    controller.onLayout = { [weak self] size in self?.reportLayout(size) }

    if variant == "fullScreen" {
      controller.modalPresentationStyle = .fullScreen
    } else {
      controller.modalPresentationStyle = .pageSheet
      if let sheet = controller.sheetPresentationController {
        sheet.delegate = self
        configure(sheet)
        sheet.selectedDetentIdentifier = initialDetent
      }
    }
    controller.presentationController?.delegate = self
    return controller
  }

  private func configure(_ sheet: UISheetPresentationController) {
    sheet.detents = detents
    sheet.prefersGrabberVisible = showDragHandle
    sheet.preferredCornerRadius = cornerRadius >= 0 ? cornerRadius : nil
    sheet.prefersScrollingExpandsWhenScrolledToEdge = true
    sheet.prefersEdgeAttachedInCompactHeight = true
    // Non-modal drawers leave the app underneath interactive at every detent.
    sheet.largestUndimmedDetentIdentifier = isNonModal ? largestDetentIdentifier : nil
  }

  private var isNonModal: Bool { variant == "persistent" || variant == "expandable" }

  /// Whether the sheet's tallest detent is sized to the content (iOS 16+ custom detents).
  private var usesFitDetent: Bool {
    guard #available(iOS 16.0, *) else { return false }
    return variant == "modal" || isNonModal
  }

  private var detents: [UISheetPresentationController.Detent] {
    switch variant {
    case "halfExpanded":
      return [.medium(), .large()]
    case "expanded":
      return [.large()]
    case "persistent", "expandable":
      if #available(iOS 16.0, *) {
        return [peekDetent, fitDetent]
      }
      return [.medium(), .large()]
    default: // modal
      if #available(iOS 16.0, *) {
        return [fitDetent]
      }
      return [.large()]
    }
  }

  /// Identifier of the tallest entry in `detents` (`Detent.identifier` itself needs iOS 16).
  private var largestDetentIdentifier: UISheetPresentationController.Detent.Identifier {
    usesFitDetent ? .fit : .large
  }

  private var initialDetent: UISheetPresentationController.Detent.Identifier? {
    switch variant {
    case "halfExpanded":
      return .medium
    case "persistent", "expandable":
      if #available(iOS 16.0, *) { return .peek }
      return .medium
    default:
      return nil
    }
  }

  @available(iOS 16.0, *)
  private var fitDetent: UISheetPresentationController.Detent {
    .custom(identifier: .fit) { [weak self] context in
      guard let self else { return context.maximumDetentValue }
      // The sheet can be at most this tall; JS keeps the content within it.
      self.sheetController?.maximumContentHeight = context.maximumDetentValue - self.topInset
      return min(self.contentSize.height + self.topInset, context.maximumDetentValue)
    }
  }

  @available(iOS 16.0, *)
  private var peekDetent: UISheetPresentationController.Detent {
    .custom(identifier: .peek) { [weak self] context in
      guard let self else { return 0 }
      let peek = self.peekHeight > 0 ? self.peekHeight : Self.defaultPeekHeight
      return min(peek, context.maximumDetentValue)
    }
  }

  private var topInset: CGFloat { showDragHandle && variant != "fullScreen" ? Self.grabberInset : 0 }

  private func currentStateName() -> String {
    guard let sheet = sheetController?.sheetPresentationController,
          sheetController?.modalPresentationStyle != .fullScreen else { return "expanded" }
    let identifier = sheet.selectedDetentIdentifier ?? initialDetent
    switch identifier {
    case .medium?:
      return isNonModal ? "collapsed" : "halfExpanded"
    case .peek?:
      return "collapsed"
    default:
      return "expanded"
    }
  }

  private func reportLayout(_ size: CGSize) {
    guard size.width > 0, size.height > 0, size != lastReportedLayout else { return }
    lastReportedLayout = size
    onLayout?(size)
  }

  // MARK: Action sheet

  private func makeActionSheet() -> UIAlertController {
    let alert = UIAlertController(
      title: title.isEmpty ? nil : title,
      message: message.isEmpty ? nil : message,
      preferredStyle: .actionSheet
    )
    var hasCancel = false
    for (index, action) in actions.enumerated() {
      let style: UIAlertAction.Style
      switch action.role {
      case "destructive":
        style = .destructive
      case "cancel" where !hasCancel:
        // UIAlertController allows a single cancel action.
        style = .cancel
        hasCancel = true
      default:
        style = .default
      }
      let alertAction = UIAlertAction(title: action.title, style: style) { [weak self, weak alert] _ in
        guard let self, let alert else { return }
        self.onActionPress?(index)
        self.didDismiss(alert, userInitiated: true)
      }
      alertAction.isEnabled = !action.disabled
      alert.addAction(alertAction)
    }

    // iPad shows action sheets as popovers, which need an anchor.
    if let popover = alert.popoverPresentationController, let anchor = hostView?.window {
      popover.sourceView = anchor
      popover.sourceRect = CGRect(x: anchor.bounds.midX, y: anchor.bounds.maxY, width: 0, height: 0)
      popover.permittedArrowDirections = []
      popover.delegate = self
    }
    return alert
  }

  // MARK: Helpers

  private func topViewController() -> UIViewController? {
    let window = hostView?.window ?? UIApplication.shared.connectedScenes
      .compactMap { ($0 as? UIWindowScene)?.keyWindow }
      .first
    var top = window?.rootViewController
    while let presented = top?.presentedViewController, !presented.isBeingDismissed {
      top = presented
    }
    return top
  }

  static let grabberInset: CGFloat = 20
  static let defaultPeekHeight: CGFloat = 120

  private struct SheetAction {
    let title: String
    let role: String
    let disabled: Bool
  }
}

// MARK: - Delegates

extension NativeKitBottomSheetPresenter: UISheetPresentationControllerDelegate {
  public func presentationControllerShouldDismiss(_ presentationController: UIPresentationController) -> Bool {
    isUserDismissible
  }

  public func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
    didDismiss(presentationController.presentedViewController, userInitiated: true)
  }

  public func sheetPresentationControllerDidChangeSelectedDetentIdentifier(
    _ sheetPresentationController: UISheetPresentationController
  ) {
    onStateChange?(currentStateName())
  }
}

extension NativeKitBottomSheetPresenter: UIPopoverPresentationControllerDelegate {}

extension UISheetPresentationController.Detent.Identifier {
  static let fit = UISheetPresentationController.Detent.Identifier("nativekit.fit")
  static let peek = UISheetPresentationController.Detent.Identifier("nativekit.peek")
}

/// Hosts the React content at the top of the sheet, below the grabber.
final class NativeKitSheetViewController: UIViewController {
  private let contentView: UIView
  private var contentSize: CGSize = .zero

  /// Space kept above the content for the grabber.
  var topInset: CGFloat = 0 {
    didSet { if topInset != oldValue { view.setNeedsLayout() } }
  }

  /// Whether the sheet is sized to the content, so its bounds can't tell how tall it may grow.
  var usesFitDetent = false

  /// Tallest the content can be in a content-fit sheet, reported by the detent resolver.
  var maximumContentHeight: CGFloat? {
    didSet { if maximumContentHeight != oldValue { view.setNeedsLayout() } }
  }

  var onLayout: ((CGSize) -> Void)?

  init(contentView: UIView) {
    self.contentView = contentView
    super.init(nibName: nil, bundle: nil)
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    contentView.removeFromSuperview()
    view.addSubview(contentView)
  }

  func setContentSize(_ size: CGSize) {
    contentSize = size
    if isViewLoaded { view.setNeedsLayout() }
  }

  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    let area = view.bounds.inset(by: view.safeAreaInsets)
    contentView.frame = CGRect(
      x: area.minX,
      y: area.minY + topInset,
      width: contentSize.width,
      height: contentSize.height
    )
    // A content-fit sheet is as tall as its content, so its bounds would feed the content's own
    // height back to it; wait for the detent resolver to say how tall it can get instead.
    if usesFitDetent && maximumContentHeight == nil { return }
    let available = maximumContentHeight ?? (area.height - topInset)
    onLayout?(CGSize(width: area.width, height: max(available, 0)))
  }
}
