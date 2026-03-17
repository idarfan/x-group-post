import type { ProductInfo, ShippingOptions } from "../types";

interface Props {
  value: ProductInfo;
  onChange: (v: ProductInfo) => void;
}

const SHIPPING_FIELDS: { key: keyof ShippingOptions; label: string; sub?: string }[] = [
  { key: "intl_shipping", label: "國際運費", sub: "海外寄出" },
  { key: "tax",           label: "進口稅金", sub: "含稅" },
  { key: "cvs_family",   label: "全家店到店 $60" },
  { key: "postal",       label: "郵寄費用", sub: "$80 起" },
];

export default function ProductInfoForm({ value, onChange }: Props) {
  const update = (field: keyof ProductInfo, val: string) =>
    onChange({ ...value, [field]: val });

  const updateShipping = (field: keyof ShippingOptions, val: boolean | string) =>
    onChange({ ...value, shipping: { ...value.shipping, [field]: val } });

  return (
    <div className="product-info-form">
      <label>📋 補充資訊（選填）</label>

      <div className="form-grid">
        <input
          placeholder="產品名稱"
          value={value.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          placeholder="原價（如 ¥3980）"
          value={value.original_price}
          onChange={(e) => update("original_price", e.target.value)}
        />
        <input
          placeholder="團購價（如 NT$680）"
          value={value.group_price}
          onChange={(e) => update("group_price", e.target.value)}
        />
        <input
          placeholder="下單方式（如 私訊下單）"
          value={value.order_method}
          onChange={(e) => update("order_method", e.target.value)}
        />
      </div>

      <div className="form-row">
        <input
          type="date"
          title="開團日期"
          value={value.start_date}
          onChange={(e) => update("start_date", e.target.value)}
        />
        <span>～</span>
        <input
          type="date"
          title="截團日期"
          value={value.end_date}
          onChange={(e) => update("end_date", e.target.value)}
        />
      </div>

      {/* 運費選項 */}
      <div className="shipping-section">
        <p className="shipping-title">📦 運費說明</p>
        <p className="shipping-hint">勾選「已含」項目，未勾選者將在貼文中註明「不含」</p>

        <div className="shipping-grid">
          {SHIPPING_FIELDS.map(({ key, label, sub }) => (
            <label key={key} className="shipping-option">
              <input
                type="checkbox"
                checked={value.shipping[key] as boolean}
                onChange={(e) => updateShipping(key, e.target.checked)}
              />
              <span className="shipping-label">
                {value.shipping[key] ? "✅" : "⚠️"} {label}
                {sub && <small> {sub}</small>}
              </span>
            </label>
          ))}
        </div>

        <input
          className="shipping-note"
          placeholder="運費備註（如：滿 $2000 免運、離島加收 $100）"
          value={value.shipping.note}
          onChange={(e) => updateShipping("note", e.target.value)}
        />
      </div>
    </div>
  );
}
