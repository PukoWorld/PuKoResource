# PuResFile
EN : A key-value file format.  
CN : 一種鍵對值的檔案格式。

# 簡介
PuRes使用Typescript開發，通常具有強型別定義，但參數回傳亦有例外，目的在於練習讀取和分析文字文件，並掌握其他類似模型的處理方法，以自行設計的格式進行客製化的開發，在程式設計上有諸多用途，如避免其他套件包含不必要的內容，進而加快程式運行速度。

# 使用說明
## PuRes格式
```pures
string keyname1 "";
number keyname2 123;
boolean keyname3 true;
data keyname4 {
    string keyname5 "";
    number keyname6 123;
    boolean keyname7 true;
}
```
PuRes代碼由三個部分組成，分別是
- Type
- Key
- Value 

Type用作類型註解，目前尚僅支援string、number、boolean、data等四項類型，其中data為內部PuRes代碼，用於嵌套代碼。

## 讀取方式
```javascript
/*JavaScript*/
const {LoadResFile} = require('./index.js')
var Data = LoadResFile("File Path");
var a = Data.Get("keyname");
```
```typescript
/*TypeScript*/
import { LoadResFile } from './index.js';
var Data = LoadResFile("File Path");
var a = Data.Get<Type>("keyname");
```
在TypeScript中，可以使用類型斷言來達到強型別的效果，也可設置\<T>已達成相同效果。