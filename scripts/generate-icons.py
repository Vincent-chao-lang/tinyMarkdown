#!/usr/bin/env python3
"""
Generate iOS app icons for tinyMarkdown
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 图标尺寸列表 (iOS 需要的尺寸)
ICON_SIZES = [
    (1024, 1024, 'AppStore-1024x1024@1x.png'),
    (180, 180, 'iPhone-60pt@3x.png'),
    (167, 167, 'iPad-83.5pt@2x.png'),
    (152, 152, 'iPad-76pt@2x.png'),
    (120, 120, 'iPhone-60pt@2x.png'),
    (87, 87, 'iPhone-29pt@3x.png'),
    (58, 58, 'iPhone-29pt@2x.png'),
    (80, 80, 'iPhone-40pt@2x.png'),
    (88, 88, 'iPhone-44pt@2x.png'),
]

def create_icon(size):
    """创建指定尺寸的图标"""
    # 创建图像
    img = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # 背景渐变（从深蓝到浅蓝）
    for i in range(size):
        alpha = int(255 * (1 - i / size * 0.3))
        color = (45, 55, 72, alpha)
        draw.rectangle([(0, i), (size, i+1)], fill=color)

    # 主圆角矩形背景
    margin = int(size * 0.08)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=int(size * 0.22),
        fill=(52, 73, 94, 255)
    )

    # 内圆（Markdown 符号）
    center_x = size // 2
    center_y = size // 2
    circle_radius = int(size * 0.12)

    # 绘制 MD 文字
    try:
        # 尝试使用系统字体
        font_size = int(size * 0.35)
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', font_size)
    except:
        # 如果失败，使用默认字体
        font = ImageFont.load_default()
        font_size = int(size * 0.4)

    # 绘制 "MD" 文字
    text = "MD"
    text_color = (255, 255, 255, 255)

    # 获取文字边界框
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # 居中文字
    text_x = center_x - text_width // 2
    text_y = center_y - text_height // 2 - int(size * 0.05)

    # 绘制文字阴影
    draw.text(
        (text_x + 2, text_y + 2),
        text,
        font=font,
        fill=(31, 41, 55, 200)
    )

    # 绘制主文字
    draw.text(
        (text_x, text_y),
        text,
        font=font,
        fill=text_color
    )

    # 添加 Markdown 小标记（右下角）
    marker_size = int(size * 0.08)
    marker_x = size - margin - marker_size - int(size * 0.02)
    marker_y = size - margin - marker_size - int(size * 0.02)

    # 绘制小圆点
    draw.ellipse(
        [marker_x, marker_y, marker_x + marker_size, marker_y + marker_size],
        fill=(231, 76, 60, 255)
    )

    return img

def generate_all_icons():
    """生成所有尺寸的图标"""
    # 创建输出目录
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'ios', 'tinyMarkdown', 'Images.xcassets', 'AppIcon.appiconset')
    os.makedirs(output_dir, exist_ok=True)

    # 生成各种尺寸的图标
    for size, _, filename in ICON_SIZES:
        print(f'Generating {filename}...')
        icon = create_icon(size)
        output_path = os.path.join(output_dir, filename)
        icon.save(output_path)
        print(f'  Saved to {output_path}')

    # 创建 Contents.json
    contents_json = '''{
  "images" : [
    {
      "filename" : "AppStore-1024x1024@1x.png",
      "idiom" : "ios-marketing",
      "size" : "1024x1024",
      "scale" : "1x"
    },
    {
      "filename" : "iPhone-60pt@3x.png",
      "idiom" : "iphone",
      "size" : "60x60",
      "scale" : "3x"
    },
    {
      "filename" : "iPhone-60pt@2x.png",
      "idiom" : "iphone",
      "size" : "60x60",
      "scale" : "2x"
    },
    {
      "filename" : "iPad-76pt@2x.png",
      "idiom" : "ipad",
      "size" : "76x76",
      "scale" : "2x"
    },
    {
      "filename" : "iPad-83.5pt@2x.png",
      "idiom" : "ipad",
      "size" : "83.5x83.5",
      "scale" : "2x"
    },
    {
      "filename" : "iPhone-29pt@3x.png",
      "idiom" : "iphone",
      "size" : "29x29",
      "scale" : "3x"
    },
    {
      "filename" : "iPhone-29pt@2x.png",
      "idiom" : "iphone",
      "size" : "29x29",
      "scale" : "2x"
    },
    {
      "filename" : "iPhone-40pt@2x.png",
      "idiom" : "iphone",
      "size" : "40x40",
      "scale" : "2x"
    },
    {
      "filename" : "iPhone-44pt@2x.png",
      "idiom" : "iphone",
      "size" : "44x44",
      "scale" : "2x"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}'''

    contents_path = os.path.join(output_dir, 'Contents.json')
    with open(contents_path, 'w') as f:
        f.write(contents_json)

    print(f'\n✅ Icons generated successfully!')
    print(f'📁 Output directory: {output_dir}')
    print(f'\nNext steps:')
    print(f'1. Open Xcode')
    print(f'2. Select the tinyMarkdown project')
    print(f'3. Go to the tinyMarkdown target')
    print(f'4. Under "App Icons and Launch Images", select the generated icon set')

if __name__ == '__main__':
    generate_all_icons()
