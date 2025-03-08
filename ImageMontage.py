import tkinter as tk
from tkinter import filedialog, ttk, messagebox
import os
import subprocess

class ImageMontageApp:
    def __init__(self, root):
        self.root = root
        self.root.title("图片拼接")
        self.root.geometry("600x400")
        self.root.resizable(False, False)
        
        # 存储选择的图片路径
        self.image_paths = []
        
        # 创建主框架
        self.main_frame = ttk.Frame(root, padding="20")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 美化样式
        style = ttk.Style()
        style.configure("TButton", padding=6, font=('Helvetica', 10))
        style.configure("TLabel", font=('Helvetica', 11))
        
        # 选择图片按钮
        self.select_btn = ttk.Button(self.main_frame, text="选择图片", command=self.select_images)
        self.select_btn.grid(row=0, column=0, pady=20)
        
        # 显示已选择图片数量
        self.image_count_label = ttk.Label(self.main_frame, text="已选择 0 张图片")
        self.image_count_label.grid(row=1, column=0, pady=10)

    def select_images(self):
        files = filedialog.askopenfilenames(
            title="选择图片",
            filetypes=[("Image files", "*.png *.jpg *.jpeg *.bmp *.gif")]
        )
        if files:
            self.image_paths = list(files)
            self.image_count_label.config(text=f"已选择 {len(self.image_paths)} 张图片")
            self.open_config_window()

    def open_config_window(self):
        config_window = tk.Toplevel(self.root)
        config_window.title(f"配置拼接参数 - {len(self.image_paths)} 张图片")
        config_window.geometry("300x400+650+100")
        config_window.resizable(False, False)
        
        # 配置框架
        config_frame = ttk.Frame(config_window, padding="20")
        config_frame.grid(row=0, column=0)
        
        # 行数
        ttk.Label(config_frame, text="行数:").grid(row=0, column=0, pady=10, sticky=tk.W)
        self.rows_var = tk.StringVar(value="1")
        ttk.Entry(config_frame, textvariable=self.rows_var, width=10).grid(row=0, column=1, pady=10)
        
        # 列数
        ttk.Label(config_frame, text="列数:").grid(row=1, column=0, pady=10, sticky=tk.W)
        self.cols_var = tk.StringVar(value=str(len(self.image_paths)))
        ttk.Entry(config_frame, textvariable=self.cols_var, width=10).grid(row=1, column=1, pady=10)
        
        # 间隙
        ttk.Label(config_frame, text="间隙(px):").grid(row=2, column=0, pady=10, sticky=tk.W)
        self.gap_var = tk.StringVar(value="0")
        ttk.Entry(config_frame, textvariable=self.gap_var, width=10).grid(row=2, column=1, pady=10)
        
        # 输出文件名
        ttk.Label(config_frame, text="输出文件名:").grid(row=3, column=0, pady=10, sticky=tk.W)
        self.output_var = tk.StringVar(value="montage_output.png")
        ttk.Entry(config_frame, textvariable=self.output_var, width=20).grid(row=3, column=1, pady=10)
        
        # 确认按钮
        ttk.Button(config_frame, text="确认", 
                  command=lambda: [self.start_montage(), config_window.destroy()]).grid(row=4, column=0, columnspan=2, pady=20)

    def start_montage(self):
        if not self.image_paths:
            return
            
        # 获取配置参数
        rows = self.rows_var.get()
        cols = self.cols_var.get()
        gap = self.gap_var.get()
        output = self.output_var.get()
        
        # 构建 magick 命令
        cmd = ['magick', 'montage'] + self.image_paths + [
            '-tile', f'{cols}x{rows}',
            '-geometry', f'+{gap}+{gap}',
            '-background', 'none',
            output
        ]
        
        try:
            subprocess.run(cmd, check=True)
            messagebox.showinfo("成功", f"图片已拼接完成，保存为 {output}")
        except subprocess.CalledProcessError:
            messagebox.showerror("错误", "拼接失败，请检查 magick.exe 配置")

def main():
    root = tk.Tk()
    app = ImageMontageApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
