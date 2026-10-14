import SwiftUI
import UIKit

/// Observable props bridged from the Fabric component; SwiftUI re-renders when they change.
final class NativekitViewModel: ObservableObject {
  @Published var title: String = ""
  var onPress: (() -> Void)?
}

struct NativekitContent: View {
  @ObservedObject var model: NativekitViewModel

  var body: some View {
    Button(action: { model.onPress?() }) {
      Text(model.title)
        .padding(.horizontal, 20)
        .padding(.vertical, 10)
    }
    .buttonStyle(.borderedProminent)
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}

/// Objective-C facing wrapper so the ObjC++ Fabric component view can host SwiftUI.
@objc(NativekitHostingView)
public final class NativekitHostingView: NSObject {
  private let model = NativekitViewModel()
  private lazy var hostingController: UIHostingController<NativekitContent> = {
    let controller = UIHostingController(rootView: NativekitContent(model: model))
    controller.view.backgroundColor = .clear
    return controller
  }()

  @objc public var view: UIView { hostingController.view }

  @objc public var title: String {
    get { model.title }
    set { model.title = newValue }
  }

  @objc public var onPress: (() -> Void)? {
    get { model.onPress }
    set { model.onPress = newValue }
  }
}

struct NativekitContent_Previews: PreviewProvider {
  static var previews: some View {
    let model = NativekitViewModel()
    model.title = "Hello from SwiftUI"
    return NativekitContent(model: model)
  }
}
