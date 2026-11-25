"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DIMENSIONS, EIGHT_TYPES, describeTypeRadar, radarPoints, type RadarProfile, type TypeShareData } from "./eight-types";
import { renderTypeCard } from "./type-share";
import type { PortraitStar } from "./star-portraits";
import { TYPE_IDENTITIES } from "./report-focus";

export function TypeRadar({ radar, takeaway }: { radar: RadarProfile; takeaway: string }) {
  const id = useId();
  const reading = describeTypeRadar(radar);
  const polygon = (values: readonly number[]) => radarPoints(values).map(point => point.join(",")).join(" ");
  return <figure className="type-radar">
    <figcaption><span>五维特征图</span><small>本次画像的特征侧重</small></figcaption>
    <svg viewBox="0 0 320 285" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>行动、表达、感受、坚持、变通五维特征图</title>
      <desc id={`${id}-desc`}>本套数字规则中较突出的特征：{radar.prominent.join("、")}。图形不是能力评分，越突出不代表越好。</desc>
      {[.25, .5, .75, 1].map(level => <polygon key={level} points={polygon(Array(5).fill(level))} className="radar-grid" />)}
      {radarPoints([1, 1, 1, 1, 1]).map(([x, y], i) => <line key={i} x1="160" y1="150" x2={x} y2={y} className="radar-axis" />)}
      <polygon points={polygon(radar.values)} className="radar-shape" />
      {radarPoints(radar.values).map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={reading.featured.includes(DIMENSIONS[i]) ? 5 : 3} className="radar-point" />)}
      {radarPoints([1.27, 1.27, 1.27, 1.27, 1.27]).map(([x, y], i) => <text key={i} x={x} y={y + 5} textAnchor="middle" className="radar-label">{DIMENSIONS[i]}</text>)}
    </svg>
    <p className="radar-emphasis">{reading.featured.length ? `图中更突出：${reading.featured.join("、")}` : "五项接近，没有明显侧重"}</p>
    <div className="radar-takeaway"><span>一句话看懂这份画像</span><p>{takeaway}</p></div>
    <small className="radar-note">规则示意，不是能力分数；越突出不代表越好。</small>
  </figure>;
}

export function TypeShare({ data }: { data: TypeShareData }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLButtonElement>(null);
  const imageUrl = useRef("");
  const alive = useRef(true);
  const [preview, setPreview] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; if (imageUrl.current) URL.revokeObjectURL(imageUrl.current); };
  }, []);
  const close = () => { dialog.current?.close(); returnFocus.current?.focus(); };
  const prepare = async () => {
    dialog.current?.showModal();
    if (preview || loading) return;
    setLoading(true); setMessage("");
    try {
      const result = await renderTypeCard(data);
      if (!alive.current) return;
      const url = URL.createObjectURL(result); imageUrl.current = url;
      setPreview(url); setBlob(result);
    } catch (error) { if (alive.current) setMessage(error instanceof Error ? error.message : "生成失败，请重试"); }
    finally { if (alive.current) setLoading(false); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(data.url); setMessage("测试链接已复制，不包含你的个人信息。"); }
    catch { setMessage("未能自动复制，请长按下方测试链接手动复制。"); }
  };
  const share = async () => {
    if (!blob) return;
    const file = new File([blob], `数见-${data.name}.png`, { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: `我是${data.name} · ${data.role}` });
      else if (navigator.share) await navigator.share({ title: "数见八型 · 你是哪种人？", text: `这份数字画像里，我是${data.name}，${data.role}。你是哪种人，容易在哪吃亏？传统数字文化体验。`, url: data.url });
      else setMessage("这个浏览器暂不支持直接分享。可以保存图片，再发给朋友。");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setMessage("分享没有完成，可以保存图片后再发送。");
    }
  };
  return <div className="type-share-controls">
    <button className="type-share-trigger" type="button" ref={returnFocus} onClick={prepare}>保存我的性格卡 <span aria-hidden="true">↗</span></button>
    <span className="type-share-privacy">不带手机号、年龄或性别</span>
    <dialog ref={dialog} className="type-share-dialog" aria-labelledby="share-title" onClick={event => { if (event.target === event.currentTarget) close(); }} onCancel={() => returnFocus.current?.focus()}>
      <div className="share-dialog-head"><div><small>数见八型</small><h3 id="share-title">我的性格卡</h3></div><button type="button" autoFocus onClick={close} aria-label="关闭分享卡">×</button></div>
      <p className="share-intro">我是哪种人，有什么长处，容易在哪吃亏。</p>
      {loading && <p role="status">正在本机生成图片…</p>}
      {preview && <img className="type-share-preview" src={preview} width="1080" height="1590" alt={`${data.name}分享卡，包含五维图、长处与容易吃亏的地方，不含个人信息`} />}
      {!preview && !loading && <button type="button" className="type-share-trigger" onClick={prepare}>重新生成图片</button>}
      {preview && <div className="share-actions"><a href={preview} download={`数见-${data.name}.png`} className="type-share-trigger">下载图片</a><button type="button" onClick={share}>分享给朋友</button></div>}
      <p className="share-instructions">手机上可长按图片保存；若下载未打开，请长按图片后保存到相册。</p>
      <div className="share-link-row"><a href={data.url}>{data.url}</a><button type="button" onClick={copy}>复制测试链接</button></div>
      <p className="share-message" role="status">{message}</p>
    </dialog>
  </div>;
}

export function TypeGallery({ current }: { current: PortraitStar }) {
  return <details className="type-gallery"><summary>数见八型，看看还有哪些类型 <span aria-hidden="true">＋</span></summary>
    <div className="type-gallery-grid">{Object.entries(EIGHT_TYPES).map(([key, type]) => <article key={key} className={key === current ? "is-current" : ""}>
      <span className="type-mini-seal" aria-hidden="true">{type.word}</span><h4>{type.name}{key === current && <small>本次类型</small>}</h4><strong>{TYPE_IDENTITIES[key as PortraitStar].role}</strong><p>{type.tagline}</p>
    </article>)}</div>
    <p className="type-gallery-note">同一类型也有不同表现，具体组合和生活场景会让解读有所不同。</p>
  </details>;
}
