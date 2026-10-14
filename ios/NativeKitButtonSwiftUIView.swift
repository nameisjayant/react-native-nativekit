import SwiftUI
import UIKit

/// Observable props bridged from the Fabric component; SwiftUI re-renders when they change.
final class NativeKitButtonModel: ObservableObject {
  @Published var title: String = ""
  @Published var variant: String = "filled"
  @Published var size: String = "medium"
  @Published var color: UIColor?
  @Published var textColor: UIColor?
  @Published var disabled: Bool = false
  @Published var loading: Bool = false
  @Published var cornerRadius: CGFloat = -1
  @Published var fontSize: CGFloat = 0
  @Published var fontWeight: String = "default"
  var onPress: (() -> Void)?
}

struct NativeKitButtonContent: View {
  @ObservedObject var model: NativeKitButtonModel

  private var accent: Color? { model.color.map(Color.init) }

  /// Label color: explicit `textColor`, otherwise what the variant would draw on its background.
  private var contentColor: Color {
    if let textColor = model.textColor { return Color(textColor) }
    switch model.variant {
    case "filled": return .white
    case "elevated": return accent == nil ? .accentColor : .white
    case "glass": return accent == nil ? .primary : .white
    default: return accent ?? .accentColor
    }
  }

  private var controlSize: ControlSize {
    switch model.size {
    case "small": return .small
    case "large": return .large
    default: return .regular
    }
  }

  private var weight: Font.Weight? {
    switch model.fontWeight {
    case "regular": return .regular
    case "medium": return .medium
    case "semibold": return .semibold
    case "bold": return .bold
    default: return nil
    }
  }

  private var font: Font {
    let base: Font
    if model.fontSize > 0 {
      base = .system(size: model.fontSize)
    } else {
      switch model.size {
      case "small": base = .subheadline
      case "large": base = .title3
      default: base = .body
      }
    }
    return weight.map { base.weight($0) } ?? base
  }

  private var borderShape: ButtonBorderShape {
    model.cornerRadius >= 0 ? .roundedRectangle(radius: model.cornerRadius) : .automatic
  }

  var body: some View {
    styled(
      Button(action: { if !model.loading { model.onPress?() } }) {
        HStack(spacing: 8) {
          if model.loading {
            ProgressView()
              .progressViewStyle(.circular)
              .tint(contentColor)
              .controlSize(.small)
          }
          Text(model.title)
            .font(font)
            .lineLimit(1)
        }
        .foregroundStyle(contentColor)
        .opacity(model.disabled ? 0.5 : 1)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .contentShape(Rectangle())
      }
    )
    .buttonBorderShape(borderShape)
    .controlSize(controlSize)
    .tint(accent)
    .disabled(model.disabled)
  }

  @ViewBuilder
  private func styled<Content: View>(_ button: Content) -> some View {
    switch model.variant {
    case "tonal":
      button.buttonStyle(.bordered)
    case "outlined":
      button
        .buttonStyle(.borderless)
        .overlay(
          RoundedRectangle(cornerRadius: model.cornerRadius >= 0 ? model.cornerRadius : 8)
            .strokeBorder((accent ?? .accentColor).opacity(model.disabled ? 0.3 : 1), lineWidth: 1)
        )
    case "text":
      button.buttonStyle(.borderless)
    case "glass":
      glass(button)
    case "elevated":
      button
        .buttonStyle(.borderedProminent)
        .tint(accent ?? Color(.secondarySystemBackground))
        .shadow(color: .black.opacity(model.disabled ? 0 : 0.18), radius: 3, x: 0, y: 1)
    default:
      button.buttonStyle(.borderedProminent)
    }
  }

  /// Liquid Glass on iOS 26+ (tinted with `color` when set); a material blur on older systems.
  @ViewBuilder
  private func glass<Content: View>(_ button: Content) -> some View {
    #if compiler(>=6.2)
    if #available(iOS 26.0, *) {
      if accent != nil {
        button.buttonStyle(.glassProminent)
      } else {
        button.buttonStyle(.glass)
      }
    } else {
      materialGlass(button)
    }
    #else
    materialGlass(button)
    #endif
  }

  private func materialGlass<Content: View>(_ button: Content) -> some View {
    let shape = RoundedRectangle(
      cornerRadius: model.cornerRadius >= 0 ? model.cornerRadius : .infinity,
      style: .continuous
    )
    return button
      .buttonStyle(.borderless)
      .background((accent ?? .clear).opacity(0.6), in: shape)
      .background(.ultraThinMaterial, in: shape)
      .overlay(shape.strokeBorder(.white.opacity(0.35), lineWidth: 0.5))
      .shadow(color: .black.opacity(model.disabled ? 0 : 0.12), radius: 6, x: 0, y: 2)
  }
}

/// Objective-C facing wrapper so the ObjC++ Fabric component view can host SwiftUI.
@objc(NativeKitButtonHostingView)
public final class NativeKitButtonHostingView: NSObject {
  private let model = NativeKitButtonModel()
  private lazy var hostingController: UIHostingController<NativeKitButtonContent> = {
    let controller = UIHostingController(rootView: NativeKitButtonContent(model: model))
    controller.view.backgroundColor = .clear
    return controller
  }()

  @objc public var view: UIView { hostingController.view }

  @objc public var title: String {
    get { model.title }
    set { model.title = newValue }
  }

  @objc public var variant: String {
    get { model.variant }
    set { model.variant = newValue }
  }

  @objc public var size: String {
    get { model.size }
    set { model.size = newValue }
  }

  @objc public var color: UIColor? {
    get { model.color }
    set { model.color = newValue }
  }

  @objc public var textColor: UIColor? {
    get { model.textColor }
    set { model.textColor = newValue }
  }

  @objc public var disabled: Bool {
    get { model.disabled }
    set { model.disabled = newValue }
  }

  @objc public var loading: Bool {
    get { model.loading }
    set { model.loading = newValue }
  }

  @objc public var cornerRadius: CGFloat {
    get { model.cornerRadius }
    set { model.cornerRadius = newValue }
  }

  @objc public var fontSize: CGFloat {
    get { model.fontSize }
    set { model.fontSize = newValue }
  }

  @objc public var fontWeight: String {
    get { model.fontWeight }
    set { model.fontWeight = newValue }
  }

  @objc public var onPress: (() -> Void)? {
    get { model.onPress }
    set { model.onPress = newValue }
  }
}

struct NativeKitButtonContent_Previews: PreviewProvider {
  static var previews: some View {
    let model = NativeKitButtonModel()
    model.title = "Continue"
    return NativeKitButtonContent(model: model)
      .frame(width: 240, height: 44)
  }
}
