"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="bg-stone-50 px-6 pb-16 text-stone-950">
      <section className="mx-auto max-w-5xl">
        <section className="grid gap-10 py-16 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              全球询盘
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              告诉我们你对什么感兴趣。
            </h1>

            <p className="mt-6 text-lg leading-8 text-stone-600">
              此页面是我们跨境独立站的第一个询盘入口。之后，它可以连接到电子邮件、
              WhatsApp、客户关系管理系统或订单管理系统。
            </p>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">当前 MVP 目标</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                我们目前尚未接入真正的支付功能。第一版用于收集用户兴趣、产品需求和潜在客户留言。
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">姓名</span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="你的名字"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">电子邮件</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">感兴趣的产品</span>
                <input
                  name="product"
                  type="text"
                  required
                  placeholder="产品名称或产品类别"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">信息</span>
                <textarea
                  name="message"
                  required
                  placeholder="请告诉我们您的需求、国家/地区、数量或运输问题。"
                  rows={5}
                  className="resize-none rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <button
                type="submit"
                className="rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold text-white hover:bg-stone-800"
              >
                提交询价
              </button>

              {submitted && (
                <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  询盘已提交。当前是前端演示效果，下一步可以连接邮件发送或数据库保存。
                </div>
              )}

              <p className="text-xs leading-5 text-stone-500">
                这个版本暂时不会把数据发送到服务器。我们先完成前端流程，后续再接入真实表单存储或邮件通知。
              </p>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}