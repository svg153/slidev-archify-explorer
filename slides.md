---
theme: seriph
title: Archify Explorer for Slidev
transition: fade
---

<style>
.slidev-layout {
  background: radial-gradient(ellipse at 80% 15%, #302c92 0, #171748 44%, #090b20 100%);
  color: #fff;
}

.demo-layout h1 {
  margin-bottom: 0.25em;
  font-size: 2.3rem;
}

.demo-layout .eyebrow {
  color: #a6a4ff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.demo-layout .diagram-frame {
  display: grid;
  min-height: 0;
  flex: 1;
  place-items: center;
  margin: 0.5rem 0;
  border: 1px solid rgb(166 164 255 / 25%);
  border-radius: 1rem;
  background: rgb(4 6 22 / 32%);
  padding: 0.75rem;
}

.demo-layout .diagram-frame img {
  max-height: 260px;
  width: 100%;
  object-fit: contain;
}

.demo-layout .explore-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #d6d4f7;
  font-size: 0.9rem;
}
</style>

<div class="demo-layout flex h-full flex-col">
  <div class="eyebrow">Slidev + Archify</div>
  <h1>Explore the architecture, node by node.</h1>
  <div class="diagram-frame">
    <ArchifyExplorer
      preview="diagrams/ai-sdlc-control-plane.svg"
      src="diagrams/ai-sdlc-control-plane.html"
      title="AI SDLC control plane"
      alt="AI SDLC control plane architecture"
    />
  </div>
  <div class="explore-row">
    <span>The static preview is clickable; the full diagram opens on demand.</span>
  </div>
</div>
