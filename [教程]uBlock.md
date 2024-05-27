uBlock Origin 的 JavaScript 注入过滤器指令是一个强大的功能，可以让你在不修改原始网页代码的情况下，自定义网页行为。以下是一些常用的指令和详细解释：

### 常用的 JavaScript 注入过滤器指令

1. **`setTimeout-defuser`**
   - **功能**：拦截并取消特定的 `setTimeout` 调用。
   - **用法**：
     ```plaintext
     example.com##+js(setTimeout-defuser, variableOrFunctionName, delay)
     ```
   - **示例**：
     ```plaintext
     example.com##+js(setTimeout-defuser, tpcHt0ml, 1006)
     ```

2. **`setInterval-defuser`**
   - **功能**：拦截并取消特定的 `setInterval` 调用。
   - **用法**：
     ```plaintext
     example.com##+js(setInterval-defuser, variableOrFunctionName, interval)
     ```
   - **示例**：
     ```plaintext
     example.com##+js(setInterval-defuser, adCheck, 5000)
     ```

3. **`nano-setTimeout-booster`**
   - **功能**：加速特定的 `setTimeout` 调用，将延迟时间缩短为最小值。
   - **用法**：
     ```plaintext
     example.com##+js(nano-setTimeout-booster, variableOrFunctionName, delay)
     ```
   - **示例**：
     ```plaintext
     example.com##+js(nano-setTimeout-booster, tpcHt0ml, 1006)
     ```

4. **`nano-setInterval-booster`**
   - **功能**：加速特定的 `setInterval` 调用，将间隔时间缩短为最小值。
   - **用法**：
     ```plaintext
     example.com##+js(nano-setInterval-booster, variableOrFunctionName, interval)
     ```
   - **示例**：
     ```plaintext
     example.com##+js(nano-setInterval-booster, adCheck, 5000)
     ```

5. **`abort-current-inline-script`**
   - **功能**：中止当前正在执行的内联脚本。
   - **用法**：
     ```plaintext
     example.com##+js(abort-current-inline-script, keyword1, keyword2)
     ```
   - **示例**：
     ```plaintext
     example.com##+js(abort-current-inline-script, 'ads', 'track')
     ```

6. **`remove-attr`**
   - **功能**：移除元素的特定属性。
   - **用法**：
     ```plaintext
     example.com##+js(remove-attr, attributeName)
     ```
   - **示例**：
     ```plaintext
     example.com##+js(remove-attr, 'onload')
     ```

7. **`remove-class`**
   - **功能**：移除元素的特定类。
   - **用法**：
     ```plaintext
     example.com##+js(remove-class, className)
     ```
   - **示例**：
     ```plaintext
     example.com##+js(remove-class, 'ad-banner')
     ```

8. **`addEventListener-defuser`**
   - **功能**：移除添加到元素上的特定事件监听器。
   - **用法**：
     ```plaintext
     example.com##+js(addEventListener-defuser, eventType, functionName)
     ```
   - **示例**：
     ```plaintext
     example.com##+js(addEventListener-defuser, 'click', 'trackClicks')
     ```

### 示例

以下是一些实际示例，展示如何使用这些指令来拦截和修改网页行为。

#### 1. 移除广告延迟加载

目标：移除页面上的广告延迟加载。

```plaintext
example.com##+js(setTimeout-defuser, showAds, 5000)
```

解释：这条规则会拦截 `showAds` 函数的 `setTimeout` 调用，避免延迟 5000 毫秒显示广告。

#### 2. 加速内容加载

目标：加速某个函数的执行，将延迟时间缩短为最小值。

```plaintext
example.com##+js(nano-setTimeout-booster, loadContent, 3000)
```

解释：这条规则会将 `loadContent` 函数的 `setTimeout` 延迟时间缩短为最小值，从而加速内容加载。

#### 3. 中止内联脚本

目标：中止包含特定关键词的内联脚本。

```plaintext
example.com##+js(abort-current-inline-script, 'tracking', 'ads')
```

解释：这条规则会中止任何包含 `tracking` 和 `ads` 关键词的内联脚本。

### 使用建议

1. **测试规则**：在实际应用规则之前，可以在开发者工具的控制台中测试 JavaScript 代码，确保规则的正确性。
2. **逐步应用**：一次应用一条规则，并观察其效果，以确保不会破坏页面其他功能。
3. **调试工具**：使用浏览器的开发者工具（通常可以通过按 `F12` 或 `Ctrl+Shift+I` 打开）来检查页面元素和脚本，帮助调试和编写规则。

通过这些指令，你可以更灵活地控制和定制网页行为。如果你有更多具体的问题或需要进一步的示例，请随时告诉我。
