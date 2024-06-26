## 常用功能选项
- `rclone copy`     - 复制
- `rclone move`     - 移动，如果要在移动后删除空源目录，请加上 `--delete-empty-src-dirs` 参数
- `rclone sync`     - 同步：将源目录同步到目标目录，只更改目标目录。
- `rclone size`     - 查看网盘文件占用大小。
- `rclone delete`   - 删除路径下的文件内容。
- `rclone purge`    - 删除路径及其所有文件内容。
- `rclone mkdir`    - 创建目录。
- `rclone rmdir`    - 删除目录。
- `rclone rmdirs`   - 删除指定灵境下的空目录。如果加上 `--leave-root` 参数，则不会删除根目录。
- `rclone check`    - 检查源和目的地址数据是否匹配。
- `rclone ls`       - 列出指定路径下的所有的文件以及文件大小和路径。
- `rclone lsl`      - 比上面多一个显示上传时间。
- `rclone lsd`      - 列出指定路径下的目录
- `rclone lsf`      - 列出指定路径下的目录和文件

## 常用参数
- `-n` = `--dry-run` - 测试运行，用来查看 rclone 在实际运行中会进行哪些操作。
- `-P` = `--progress` - 显示实时传输进度，500mS 刷新一次，否则默认 1 分钟刷新一次。
- `--cache-chunk-size` *SizeSuffi* - 块的大小，默认5M，理论上是越大上传速度越快，同时占用内存也越多。如果设置得太大，可能会导致进程中断。
- `--cache-chunk-total-size` *SizeSuffix* - 块可以在本地磁盘上占用的总大小，默认10G。
- `--transfers=N` - 并行文件数，默认为4。在比较小的内存的VPS上建议调小这个参数，比如128M的小鸡上使用建议设置为1。
- `--config` *string* - 指定配置文件路径，*string* 为配置文件路径。
- `--ignore-errors` - 跳过错误。
  - 比如 OneDrive 在传了某些特殊文件后会提示 "Failed to copy: failed to open source object: malwareDetected: Malware detected"，这会导致后续的传输任务被终止掉，此时就可以加上这个参数跳过错误。但需要注意 RCLONE 的退出状态码不会为0。

## 文件过滤
- `--exclude` - 排除文件或目录。
- `--include` - 包含文件或目录。
- `--filter` - 文件过滤规则，相当于上面两个选项的其它使用方式。包含规则以 + 开头，排除规则以 - 开头。

## 文件类型过滤
比如 `--exclude "*.bak"`、`--filter "- *.bak"`，排除所有 bak 文件。也可以写作。
比如 `--include "*.{png,jpg}"`、`--filter "+ *.{png,jpg}"`，包含所有 png 和 jpg 文件，排除其他文件。
`--delete-excluded` 删除排除的文件。需配合过滤参数使用，否则无效。

## 目录过滤
目录过滤需要在目录名称后面加上 `/`，否则会被当做文件进行匹配。以 `/` 开头只会匹配根目录（指定目录下），否则匹配所目录。这同样适用于文件。
- `--exclude ".git/"` 排除所有目录下的 `.git` 目录。
- `--exclude "/.git/"` 只排除根目录下的 `.git` 目录。
- `--exclude "{Video,Software}/"` 排除所有目录下的 Video 和 Software 目录。
- `--exclude "/{Video,Software}/"` 只排除根目录下的 Video 和 Software 目录。
- `--include "/{Video,Software}/**"` 仅包含根目录下的 Video 和 Software 目录的所有内容。

## 文件大小过滤
默认大小单位为 kBytes ，但可以使用 k ，M 或 G 后缀。
- `--min-size` 过滤小于指定大小的文件。比如 `--min-size 50` 表示不会传输小于 50k 的文件。
- `--max-size` 过滤大于指定大小的文件。比如 `--max-size 1G` 表示不会传输大于 1G 的文件。

## TIPS
在实际使用中发现大小过滤两个选项不能同时使用。
