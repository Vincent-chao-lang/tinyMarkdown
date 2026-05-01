import UIKit
import React
import React_RCTAppDelegate

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  var loadingWindow: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    NSLog("[AppDelegate] ========== didFinishLaunchingWithOptions called ==========")

    // 创建主window
    window = UIWindow(frame: UIScreen.main.bounds)

    // 显示加载视图（使用独立的window）
    showLoadingWindow()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    // 监听多种React Native加载完成的通知
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(onReactNativeReady),
      name: NSNotification.Name("RCTJavaScriptDidLoad"),
      object: nil
    )

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(onReactNativeReady),
      name: NSNotification.Name("RCTContentDidAppear"),
      object: nil
    )

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(onReactNativeReady),
      name: NSNotification.Name("RCTBridgeDidLoad"),
      object: nil
    )

    // 延迟一点启动React Native，确保加载视图先显示
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
      factory.startReactNative(
        withModuleName: "tinyMarkdown",
        in: self.window,
        launchOptions: launchOptions
      )
    }

    // 设置最小显示时间：确保加载窗口至少显示2.5秒
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
      self.minDisplayTimeElapsed = true
      self.tryHideLoadingWindow()
    }

    // 备用方案：如果通知没有触发，5秒后强制隐藏
    DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
      if self.loadingWindow != nil {
        NSLog("[AppDelegate] Force hiding loading window after timeout")
        self.hideLoadingWindow()
      }
    }

    // 检查是否通过文件启动应用
    NSLog("[AppDelegate] Checking launchOptions for file URL...")
    NSLog("[AppDelegate] launchOptions: \(launchOptions ?? [:])")

    if let fileURL = launchOptions?[.url] as? URL {
      NSLog("[AppDelegate] Launching with file URL: \(fileURL)")
      handleFileURL(fileURL)
    } else {
      NSLog("[AppDelegate] No file URL in launchOptions")
    }

    return true
  }

  var minDisplayTimeElapsed = false
  var reactNativeReady = false

  // React Native加载完成
  @objc private func onReactNativeReady() {
    NSLog("[AppDelegate] React Native ready")
    reactNativeReady = true
    tryHideLoadingWindow()
  }

  // 尝试隐藏加载窗口（需要同时满足：最小显示时间已过 && React Native已就绪）
  private func tryHideLoadingWindow() {
    if minDisplayTimeElapsed && reactNativeReady {
      NSLog("[AppDelegate] Both conditions met, hiding loading window")
      hideLoadingWindow()
    }
  }

  // 显示加载窗口
  private func showLoadingWindow() {
    let loadingWindow = UIWindow(frame: UIScreen.main.bounds)
    loadingWindow.rootViewController = UIViewController()
    loadingWindow.windowLevel = UIWindow.Level.alert + 1
    loadingWindow.backgroundColor = UIColor(red: 250/255, green: 251/255, blue: 252/255, alpha: 1)

    let containerView = UIView()
    containerView.translatesAutoresizingMaskIntoConstraints = false
    loadingWindow.rootViewController?.view.addSubview(containerView)

    // 创建logo容器
    let logoContainer = UIView()
    logoContainer.translatesAutoresizingMaskIntoConstraints = false
    containerView.addSubview(logoContainer)

    // Logo emoji
    let logoLabel = UILabel()
    logoLabel.text = "📄"
    logoLabel.font = UIFont.systemFont(ofSize: 64)
    logoLabel.textAlignment = .center
    logoLabel.translatesAutoresizingMaskIntoConstraints = false
    logoContainer.addSubview(logoLabel)

    // App名称
    let titleLabel = UILabel()
    titleLabel.text = "tinyMarkdown"
    titleLabel.font = UIFont.boldSystemFont(ofSize: 28)
    titleLabel.textColor = UIColor(red: 26/255, green: 26/255, blue: 26/255, alpha: 1)
    titleLabel.textAlignment = .center
    titleLabel.translatesAutoresizingMaskIntoConstraints = false
    logoContainer.addSubview(titleLabel)

    // 加载文本
    let loadingLabel = UILabel()
    loadingLabel.text = "正在初始化..."
    loadingLabel.font = UIFont.systemFont(ofSize: 16)
    loadingLabel.textColor = UIColor(red: 142/255, green: 142/255, blue: 147/255, alpha: 1)
    loadingLabel.textAlignment = .center
    loadingLabel.translatesAutoresizingMaskIntoConstraints = false
    logoContainer.addSubview(loadingLabel)

    // 进度提示
    let progressLabel = UILabel()
    progressLabel.text = "正在加载服务..."
    progressLabel.font = UIFont.systemFont(ofSize: 14)
    progressLabel.textColor = UIColor(red: 142/255, green: 142/255, blue: 147/255, alpha: 1)
    progressLabel.textAlignment = .center
    progressLabel.translatesAutoresizingMaskIntoConstraints = false
    logoContainer.addSubview(progressLabel)

    // 底部标识
    let footerLabel = UILabel()
    footerLabel.text = "Powered by Chao's lab"
    footerLabel.font = UIFont.systemFont(ofSize: 13)
    footerLabel.textColor = UIColor(red: 199/255, green: 199/255, blue: 204/255, alpha: 1)
    footerLabel.textAlignment = .center
    footerLabel.translatesAutoresizingMaskIntoConstraints = false
    containerView.addSubview(footerLabel)

    // 设置约束
    NSLayoutConstraint.activate([
      // 容器填充整个视图
      containerView.topAnchor.constraint(equalTo: loadingWindow.rootViewController!.view.topAnchor),
      containerView.leadingAnchor.constraint(equalTo: loadingWindow.rootViewController!.view.leadingAnchor),
      containerView.trailingAnchor.constraint(equalTo: loadingWindow.rootViewController!.view.trailingAnchor),
      containerView.bottomAnchor.constraint(equalTo: loadingWindow.rootViewController!.view.bottomAnchor),

      // Logo容器居中
      logoContainer.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
      logoContainer.centerYAnchor.constraint(equalTo: containerView.centerYAnchor),

      // Logo emoji
      logoLabel.centerXAnchor.constraint(equalTo: logoContainer.centerXAnchor),
      logoLabel.topAnchor.constraint(equalTo: logoContainer.topAnchor),

      // 标题
      titleLabel.centerXAnchor.constraint(equalTo: logoContainer.centerXAnchor),
      titleLabel.topAnchor.constraint(equalTo: logoLabel.bottomAnchor, constant: 8),

      // 加载文本
      loadingLabel.centerXAnchor.constraint(equalTo: logoContainer.centerXAnchor),
      loadingLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 24),

      // 进度提示
      progressLabel.centerXAnchor.constraint(equalTo: logoContainer.centerXAnchor),
      progressLabel.topAnchor.constraint(equalTo: loadingLabel.bottomAnchor, constant: 8),

      // 底部标识
      footerLabel.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
      footerLabel.bottomAnchor.constraint(equalTo: containerView.safeAreaLayoutGuide.bottomAnchor, constant: -32),
    ])

    self.loadingWindow = loadingWindow
    loadingWindow.isHidden = false
    loadingWindow.makeKeyAndVisible()
  }

  // 隐藏加载窗口
  @objc private func hideLoadingWindow() {
    NSLog("[AppDelegate] hideLoadingWindow called, loadingWindow: \(self.loadingWindow != nil)")

    guard self.loadingWindow != nil else {
      NSLog("[AppDelegate] loadingWindow already nil, skipping")
      return
    }

    DispatchQueue.main.async {
      UIView.animate(withDuration: 0.3, animations: {
        self.loadingWindow?.alpha = 0
      }) { _ in
        NSLog("[AppDelegate] Hiding loading window")
        self.loadingWindow?.isHidden = true
        self.loadingWindow = nil
      }
    }
  }

  func applicationWillEnterForeground(_ application: UIApplication) {
    NSLog("[AppDelegate] ========== applicationWillEnterForeground called ==========")
  }

  func applicationDidBecomeActive(_ application: UIApplication) {
    NSLog("[AppDelegate] ========== applicationDidBecomeActive called ==========")
  }

  // 处理文件 URL（iOS 9+）
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    NSLog("[AppDelegate] ========== openURL called ==========")
    NSLog("[AppDelegate] URL: \(url)")
    NSLog("[AppDelegate] isFileURL: \(url.isFileURL)")

    if url.isFileURL {
      handleFileURL(url)
    } else {
      NSLog("[AppDelegate] Not a file URL, ignoring")
    }
    return true
  }

  // 处理文件 URL 的通用方法
  private func handleFileURL(_ fileURL: URL) {
    NSLog("[AppDelegate] ========== handleFileURL called ==========")
    NSLog("[AppDelegate] fileURL: \(fileURL)")
    NSLog("[AppDelegate] fileURL.path: \(fileURL.path)")
    NSLog("[AppDelegate] fileURL.absoluteString: \(fileURL.absoluteString)")

    let fileName = fileURL.lastPathComponent
    var fileSize: Int64 = 0

    // 获取文件大小
    do {
      let attributes = try FileManager.default.attributesOfItem(atPath: fileURL.path)
      if let size = attributes[.size] as? Int64 {
        fileSize = size
      }
      NSLog("[AppDelegate] File attributes retrieved successfully")
    } catch {
      NSLog("[AppDelegate] Error getting file attributes: \(error)")
    }

    NSLog("[AppDelegate] File info - Name: \(fileName), Size: \(fileSize)")

    // 注意：不在这里调用 startAccessingSecurityScopedResource
    // 因为调用后需要在适当的时候调用 stopAccessingSecurityScopedResource
    // 我们将在 FileReaderModule 中处理安全范围资源访问

    // 存储初始文件信息到 UserDefaults
    let defaults = UserDefaults.standard
    defaults.set(fileURL.absoluteString, forKey: "initialFileUri")
    defaults.set(fileName, forKey: "initialFileName")
    defaults.set(fileSize, forKey: "initialFileSize")
    defaults.synchronize()

    NSLog("[AppDelegate] File stored in UserDefaults successfully")
  }

  // 处理用户活动（iOS 13+）
  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    NSLog("[AppDelegate] ========== continueUserActivity called ==========")
    NSLog("[AppDelegate] userActivity.activityType: \(userActivity.activityType)")
    NSLog("[AppDelegate] userActivity.webpageURL: \(userActivity.webpageURL ?? URL(string: "nil")!)")

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
