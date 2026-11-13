/* VIII Taller de Análisis No Lineal y EDP · 2027 */
(() => {
	"use strict";

	const $ = (s, el = document) => el.querySelector(s);
	const $$ = (s, el = document) => [...el.querySelectorAll(s)];
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	/* ---------- Navegación ---------- */
	const nav = $("#nav");
	const toggle = $("#navToggle");
	const menu = $("#mobileMenu");

	const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 40 || document.body.classList.contains("menu-open"));
	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	const setMenu = (open) => {
		toggle.setAttribute("aria-expanded", String(open));
		toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
		menu.hidden = !open;
		document.body.classList.toggle("menu-open", open);
		onScroll();
	};
	toggle.addEventListener("click", () => setMenu(menu.hidden));
	$$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && !menu.hidden) setMenu(false);
	});
	window.matchMedia("(min-width: 1101px)").addEventListener("change", (e) => e.matches && setMenu(false));

	// Sección activa
	const links = $$(".nav__links a");
	const spy = new IntersectionObserver(
		(entries) => {
			entries.forEach((en) => {
				if (!en.isIntersecting) return;
				links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id));
			});
		},
		{ rootMargin: "-45% 0px -50% 0px" }
	);
	$$("main section[id]").forEach((s) => spy.observe(s));

	/* ---------- Aparición al hacer scroll ---------- */
	$$(".speakers .speaker").forEach((el, i) => el.style.setProperty("--d", (i % 4) * 70 + "ms"));
	$$(".committees .committee, .venues figure").forEach((el, i) => el.style.setProperty("--d", (i % 2) * 120 + "ms"));
	if ("IntersectionObserver" in window && !reduceMotion) {
		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((en) => {
					if (en.isIntersecting) {
						en.target.classList.add("is-in");
						io.unobserve(en.target);
					}
				}),
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
		);
		$$(".reveal").forEach((el) => io.observe(el));
	} else {
		$$(".reveal").forEach((el) => el.classList.add("is-in"));
	}

	/* ---------- Cuentas regresivas ---------- */
	const EVENT_END = new Date("2027-06-05T11:00:00-05:00");
	const cd = $("#countdown");
	const start = new Date(cd.dataset.target);
	const pad = (n) => String(n).padStart(2, "0");
	const units = { d: $('[data-unit="d"]', cd), h: $('[data-unit="h"]', cd), m: $('[data-unit="m"]', cd), s: $('[data-unit="s"]', cd) };

	const tick = () => {
		const now = new Date();
		let diff = start - now;
		if (diff <= 0) {
			cd.classList.add("is-live");
			cd.innerHTML = now < EVENT_END ? "<div><b>En curso</b><span>¡Bienvenidos a Pereira!</span></div>" : "<div><b>¡Gracias!</b><span>Nos vemos en la próxima edición</span></div>";
			return false;
		}
		const d = Math.floor(diff / 864e5);
		diff -= d * 864e5;
		const h = Math.floor(diff / 36e5);
		diff -= h * 36e5;
		const m = Math.floor(diff / 6e4);
		const s = Math.floor((diff - m * 6e4) / 1e3);
		units.d.textContent = d;
		units.h.textContent = pad(h);
		units.m.textContent = pad(m);
		units.s.textContent = pad(s);
		return true;
	};
	if (tick()) {
		const id = setInterval(() => tick() || clearInterval(id), 1000);
	}

	const dl = $("#deadlineLeft");
	const dlShort = $("#deadlineShort");
	const days = Math.ceil((new Date(dl.dataset.target) - new Date()) / 864e5);
	if (days > 0) {
		dl.innerHTML = `Faltan <b>${days} ${days === 1 ? "día" : "días"}</b> para el cierre de la convocatoria.`;
		dlShort.textContent = `Fecha límite · faltan ${days} ${days === 1 ? "día" : "días"}`;
	} else {
		dl.textContent = "La convocatoria de ponencias está cerrada.";
		dlShort.textContent = "Convocatoria cerrada";
	}

	/* ---------- Calendario (.ics) ---------- */
	const ics = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//UTP//Taller Analisis No Lineal 2027//ES",
		"CALSCALE:GREGORIAN",
		"BEGIN:VEVENT",
		"UID:taller-anl-edp-2027@utp.edu.co",
		"DTSTAMP:20261101T000000Z",
		"DTSTART;VALUE=DATE:20270602",
		"DTEND;VALUE=DATE:20270606",
		"SUMMARY:VIII Taller de Análisis No Lineal y EDP",
		"LOCATION:Universidad Tecnológica de Pereira\\, Pereira\\, Colombia",
		"DESCRIPTION:VIII Taller Internacional de Análisis No Lineal y Ecuaciones Diferenciales Parciales.",
		"END:VEVENT",
		"END:VCALENDAR",
	].join("\r\n");
	$("#icsBtn").href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));

	/* ---------- Pestañas del cronograma ---------- */
	const tabs = $$('.days [role="tab"]');
	const selectTab = (tab, focus) => {
		tabs.forEach((t) => {
			const on = t === tab;
			t.classList.toggle("is-active", on);
			t.setAttribute("aria-selected", String(on));
			t.tabIndex = on ? 0 : -1;
			$("#" + t.getAttribute("aria-controls")).hidden = !on;
		});
		if (focus) tab.focus();
	};
	tabs.forEach((t, i) => {
		t.addEventListener("click", () => selectTab(t));
		t.addEventListener("keydown", (e) => {
			const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
			if (k) {
				e.preventDefault();
				selectTab(tabs[(i + k + tabs.length) % tabs.length], true);
			} else if (e.key === "Home") {
				e.preventDefault();
				selectTab(tabs[0], true);
			} else if (e.key === "End") {
				e.preventDefault();
				selectTab(tabs[tabs.length - 1], true);
			}
		});
	});

	// Durante el evento: abrir el día actual y resaltar el bloque en curso
	const bogotaToday = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
	const todayTab = tabs.find((t) => t.dataset.date === bogotaToday);
	if (todayTab) {
		todayTab.classList.add("is-today");
		selectTab(todayTab);
		const markNow = () => {
			const now = new Date();
			$$(".slot").forEach((s) => {
				const a = new Date(s.dataset.start + ":00-05:00");
				const b = new Date(s.dataset.end + ":00-05:00");
				s.classList.toggle("is-now", now >= a && now < b);
			});
		};
		markNow();
		setInterval(markNow, 60000);
	}

	/* ---------- Filtro de conferencistas ---------- */
	const segs = $$(".seg__btn");
	const speakers = $$("#speakers .speaker");
	segs.forEach((b) =>
		b.addEventListener("click", () => {
			segs.forEach((x) => {
				x.classList.toggle("is-active", x === b);
				x.setAttribute("aria-pressed", String(x === b));
			});
			const f = b.dataset.filter;
			speakers.forEach((s) => {
				s.classList.toggle("is-hidden", f !== "all" && s.dataset.group !== f);
				s.classList.add("is-in");
			});
		})
	);

	/* ---------- Copiar correo ---------- */
	const toast = $("#toast");
	let toastT;
	const say = (msg) => {
		toast.textContent = msg;
		toast.classList.add("is-on");
		clearTimeout(toastT);
		toastT = setTimeout(() => toast.classList.remove("is-on"), 2200);
	};
	$$("[data-copy]").forEach((b) =>
		b.addEventListener("click", async () => {
			try {
				await navigator.clipboard.writeText(b.dataset.copy);
				say("Correo copiado");
			} catch {
				say(b.dataset.copy);
			}
		})
	);

	/* ---------- Galería / lightbox ---------- */
	const lb = $("#lightbox");
	const items = $$("#gallery .g");
	let cur = 0;
	const show = (i) => {
		cur = (i + items.length) % items.length;
		const it = items[cur];
		const img = $("img", lb);
		img.src = it.dataset.full;
		img.alt = it.dataset.caption;
		$("figcaption", lb).textContent = `${it.dataset.caption} · ${cur + 1}/${items.length}`;
	};
	if (lb && typeof lb.showModal === "function") {
		items.forEach((it, i) =>
			it.addEventListener("click", () => {
				show(i);
				lb.showModal();
			})
		);
		$(".lightbox__close", lb).addEventListener("click", () => lb.close());
		$(".lightbox__prev", lb).addEventListener("click", () => show(cur - 1));
		$(".lightbox__next", lb).addEventListener("click", () => show(cur + 1));
		lb.addEventListener("click", (e) => e.target === lb && lb.close());
		lb.addEventListener("keydown", (e) => {
			if (e.key === "ArrowRight") show(cur + 1);
			if (e.key === "ArrowLeft") show(cur - 1);
		});
		// Gestos táctiles
		let x0 = null;
		lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
		lb.addEventListener("touchend", (e) => {
			if (x0 === null) return;
			const dx = e.changedTouches[0].clientX - x0;
			if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
			x0 = null;
		});
	}

	/* ---------- Video (carga diferida) ---------- */
	const video = $("#video");
	video.addEventListener("click", () => {
		if (video.classList.contains("is-playing")) return;
		const f = document.createElement("iframe");
		f.src = `https://www.youtube-nocookie.com/embed/${video.dataset.yt}?autoplay=1&rel=0`;
		f.title = "Video sobre Pereira";
		f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
		f.allowFullscreen = true;
		video.appendChild(f);
		video.classList.add("is-playing");
	});

	/* ---------- Hero: flujo del oscilador de Van der Pol ----------
	   x' = y,  y' = μ(1 − x²)y − x
	   Las partículas recorren el plano de fase y convergen al ciclo límite. */
	const cv = $("#flow");
	const ctx = cv.getContext("2d");
	const MU = 1.15;
	let W = 0,
		H = 0,
		SX = 1,
		SY = 1,
		dpr = 1,
		parts = [],
		running = false,
		raf = 0;

	const toScreen = (x, y) => [W / 2 + x * SX, H / 2 - y * SY];
	// Velocidad en unidades del plano de fase por segundo (muy lenta: deriva "espacial")
	const SPEED = 0.11;
	const TRAIL = 34; // puntos de la estela
	const SAMPLE = 0.12; // segundos entre puntos de la estela
	const FADE = 2.5; // segundos de fundido al nacer / morir
	const EDGE = 90; // px de atenuación junto a los bordes

	const spawn = (p) => {
		p.x = (Math.random() * 2 - 1) * (W / 2 / SX) * 1.05;
		p.y = (Math.random() * 2 - 1) * (H / 2 / SY) * 1.05;
		p.age = 0;
		p.life = 14 + Math.random() * 22; // segundos
		p.trail = [];
		p.acc = 0;
		p.tw = Math.random() * Math.PI * 2; // fase de parpadeo
		p.r = 0.6 + Math.random() * 0.9;
		p.dying = false;
		return p;
	};
	const resize = () => {
		dpr = Math.min(window.devicePixelRatio || 1, 1.5);
		W = cv.clientWidth;
		H = cv.clientHeight;
		cv.width = W * dpr;
		cv.height = H * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		// El ciclo límite (|x| ≲ 2, |y| ≲ 2.6) ocupa casi todo el hero
		SX = W / 5.4;
		SY = H / 6.4;
		const n = Math.min(420, Math.round((W * H) / 3400));
		parts = Array.from({ length: n }, () => spawn({}));
		parts.forEach((p) => (p.age = Math.random() * p.life * 0.8));
	};

	const update = (dt) => {
		for (const p of parts) {
			const vx = p.y;
			const vy = MU * (1 - p.x * p.x) * p.y - p.x;
			const sp = Math.hypot(vx, vy) || 1;
			const k = (Math.min(sp, 3) / sp) * SPEED * dt; // rapidez acotada
			p.x += vx * k;
			p.y += vy * k;
			p.age += dt;
			p.acc += dt;
			if (p.acc >= SAMPLE) {
				p.acc = 0;
				p.trail.push(toScreen(p.x, p.y));
				if (p.trail.length > TRAIL) p.trail.shift();
			}
			const [sx, sy] = toScreen(p.x, p.y);
			// Fuera de pantalla: en lugar de desaparecer de golpe, inicia el fundido de salida
			if (!p.dying && (sx < 0 || sx > W || sy < 0 || sy > H)) {
				p.dying = true;
				p.life = Math.min(p.life, p.age + FADE);
			}
			if (p.age > p.life) spawn(p);
		}
	};

	// Los segmentos se agrupan por color y nivel de opacidad: pocas llamadas a stroke() por cuadro
	const LEVELS = 8;
	const MAX_A = 0.34;
	const COLORS = ["160, 205, 255", "255, 200, 120"];
	const buckets = COLORS.map(() => Array.from({ length: LEVELS }, () => new Path2D()));
	const dots = COLORS.map(() => Array.from({ length: LEVELS }, () => new Path2D()));

	const draw = (t) => {
		ctx.clearRect(0, 0, W, H);
		for (let c = 0; c < 2; c++)
			for (let l = 0; l < LEVELS; l++) {
				buckets[c][l] = new Path2D();
				dots[c][l] = new Path2D();
			}
		for (const p of parts) {
			const [hx, hy] = toScreen(p.x, p.y);
			// Atenuación suave cerca de los bordes (más amplia abajo, donde el hero funde a negro)
			const edge = Math.min(1, hx / EDGE, (W - hx) / EDGE, hy / EDGE, (H - hy) / (EDGE * 2.2));
			const life = Math.min(1, p.age / FADE, (p.life - p.age) / FADE) * Math.max(0, edge);
			if (life <= 0.01) continue;
			const vx = p.y;
			const vy = MU * (1 - p.x * p.x) * p.y - p.x;
			const c = Math.hypot(vx, vy) > 2.2 ? 1 : 0;
			const tr = p.trail;
			const n = tr.length;
			for (let i = 1; i <= n; i++) {
				const l = Math.min(LEVELS - 1, Math.floor((i / n) * life * LEVELS));
				if (l < 0) continue;
				const a = tr[i - 1];
				const b = i < n ? tr[i] : [hx, hy];
				buckets[c][l].moveTo(a[0], a[1]);
				buckets[c][l].lineTo(b[0], b[1]);
			}
			// Cabeza: pequeña estrella con parpadeo
			const tw = 0.6 + 0.4 * Math.sin(t * 1.3 + p.tw);
			const l = Math.min(LEVELS - 1, Math.floor(life * tw * LEVELS));
			dots[c][l].moveTo(hx + p.r, hy);
			dots[c][l].arc(hx, hy, p.r, 0, Math.PI * 2);
		}
		ctx.lineWidth = 1;
		ctx.lineCap = "round";
		for (let c = 0; c < 2; c++)
			for (let l = 0; l < LEVELS; l++) {
				const k = (l + 1) / LEVELS;
				ctx.strokeStyle = `rgba(${COLORS[c]}, ${(k * MAX_A).toFixed(3)})`;
				ctx.stroke(buckets[c][l]);
				ctx.fillStyle = `rgba(${COLORS[c]}, ${(k * 0.95).toFixed(3)})`;
				ctx.fill(dots[c][l]);
			}
	};

	let last = 0;
	const loop = (now) => {
		const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
		last = now;
		update(dt);
		draw(now / 1000);
		raf = requestAnimationFrame(loop);
	};
	const warmUp = () => {
		for (let i = 0; i < 300; i++) update(1 / 30); // estelas ya formadas al cargar
	};
	const play = () => {
		if (running || reduceMotion) return;
		running = true;
		raf = requestAnimationFrame(loop);
	};
	const pause = () => {
		running = false;
		last = 0;
		cancelAnimationFrame(raf);
	};

	resize();
	warmUp();
	if (reduceMotion) {
		draw(0); // imagen estática
	} else {
		new IntersectionObserver(([en]) => (en.isIntersecting ? play() : pause())).observe(cv);
		document.addEventListener("visibilitychange", () => (document.hidden ? pause() : play()));
	}
	let rt;
	window.addEventListener("resize", () => {
		clearTimeout(rt);
		rt = setTimeout(() => {
			const w = cv.clientWidth;
			if (Math.abs(w - W) > 40 || Math.abs(cv.clientHeight - H) > 120) {
				resize();
				warmUp();
				if (reduceMotion) draw(0);
			}
		}, 200);
	});
})();
