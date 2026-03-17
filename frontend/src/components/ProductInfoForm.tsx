import type { ProductInfo, ShippingOptions } from "../types";

interface Props {
  value: ProductInfo;
  onChange: (v: ProductInfo) => void;
}

const CVS_FEES = [68, 72, 78] as const;

export default function ProductInfoForm({ value, onChange }: Props) {
  const update = (field: keyof ProductInfo, val: string) =>
    onChange({ ...value, [field]: val });

  const updateShipping = <K extends keyof ShippingOptions>(
    field: K,
    val: ShippingOptions[K]
  ) => onChange({ ...value, shipping: { ...value.shipping, [field]: val } });

  const { delivery, cvs_family_fee } = value.shipping;

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

        {/* 國際運費 & 稅金 — 獨立 checkbox */}
        <div className="shipping-grid">
          {(
            [
              { key: "intl_shipping", label: "國際運費", sub: "海外寄出" },
              { key: "tax",           label: "進口稅金", sub: "含稅" },
            ] as const
          ).map(({ key, label, sub }) => (
            <label key={key} className="shipping-option">
              <input
                type="checkbox"
                checked={value.shipping[key]}
                onChange={(e) => updateShipping(key, e.target.checked)}
              />
              <span className="shipping-label">
                {value.shipping[key] ? "✅" : "⚠️"} {label}
                {sub && <small> {sub}</small>}
              </span>
            </label>
          ))}
        </div>

        {/* 物流方式 — 互斥單選 */}
        <div className="shipping-delivery-group">
          <p className="shipping-label" style={{ marginBottom: "0.35rem" }}>
            物流方式（已含）
          </p>

          {/* 不含 */}
          <label className="shipping-option">
            <input
              type="radio"
              name="delivery"
              value=""
              checked={delivery === ""}
              onChange={() => updateShipping("delivery", "")}
            />
            <span className="shipping-label">⚠️ 不含物流費</span>
          </label>

          {/* 全家店到店 */}
          <label className="shipping-option">
            <input
              type="radio"
              name="delivery"
              value="cvs_family"
              checked={delivery === "cvs_family"}
              onChange={() => updateShipping("delivery", "cvs_family")}
            />
            <span className="shipping-label">✅ 全家店到店</span>
          </label>

          {/* 全家費用子選項 */}
          {delivery === "cvs_family" && (
            <div className="cvs-fee-group">
              {CVS_FEES.map((fee) => (
                <label key={fee} className="cvs-fee-option">
                  <input
                    type="radio"
                    name="cvs_family_fee"
                    value={fee}
                    checked={cvs_family_fee === fee}
                    onChange={() => updateShipping("cvs_family_fee", fee)}
                  />
                  <span>${fee}</span>
                </label>
              ))}
            </div>
          )}

          {/* 郵寄 */}
          <label className="shipping-option">
            <input
              type="radio"
              name="delivery"
              value="postal"
              checked={delivery === "postal"}
              onChange={() => updateShipping("delivery", "postal")}
            />
            <span className="shipping-label">✅ 郵寄</span>
          </label>
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
