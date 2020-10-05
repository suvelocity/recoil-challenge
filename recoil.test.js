const puppeteer = require("puppeteer");

let page;
let browser;
jest.setTimeout(30000);
describe("Can add background color functionality", () => {
	beforeAll(async () => {
		//open a chromium browser
		browser = await puppeteer.launch({ headless: true });
		//open a new page within that browser
		page = await browser.newPage();
		//go to our app
		await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
	});
	afterAll(async () => {
		//close the chromium after each test
		await browser.close();
	});

	test("using normal state ", async () => {
		const canvasColor = await page.$eval(
			".canvas",
			e => getComputedStyle(e).backgroundColor
		);

		// change color input color to a random color
		await page.waitForSelector("#colorPickerInput");
		await page.click("#colorPickerInput");
		const arrowDown = Math.floor(Math.random() * 50) + 1;
		for (let i = 0; i < arrowDown; i++) {
			await page.keyboard.press("ArrowDown");
		}
		const arrowRight = Math.floor(Math.random() * 50) + 1;
		for (let i = 0; i < arrowRight; i++) {
			await page.keyboard.press("ArrowRight");
		}
		const color = await page.$eval("#colorPickerInput", e => e.value);

		// get canvas background color after the change
		const canvasColorAfter = await page.$eval(".canvas", e => {
			return getComputedStyle(e).backgroundColor;
		});
		// test the the background has been change
		expect(canvasColorAfter).not.toBe(canvasColor);
		// test the the background is equal to the color input value
		expect(rgbToHex(canvasColorAfter)).toBe(color);
	});

	test("without rendering the 'App' component ", async () => {
		const canvasColor = await page.$eval(
			".canvas",
			e => getComputedStyle(e).backgroundColor
		);

		// change color input color to a random color
		await page.waitForSelector("#colorPickerInput");
		await page.click("#colorPickerInput");
		const arrowDown = Math.floor(Math.random() * 50) + 1;
		for (let i = 0; i < arrowDown; i++) {
			await page.keyboard.press("ArrowDown");
		}
		const arrowRight = Math.floor(Math.random() * 50) + 1;
		for (let i = 0; i < arrowRight; i++) {
			await page.keyboard.press("ArrowRight");
		}
		const color = await page.$eval("#colorPickerInput", e => e.value);

		// get canvas background color after the change
		const canvasColorAfter = await page.$eval(".canvas", e => {
			return getComputedStyle(e).backgroundColor;
		});

		const appRendersCount = await page.evaluate(
			() => document.querySelector("#app-render").innerText
		);
		// test the the background has been change
		expect(canvasColorAfter).not.toBe(canvasColor);
		// test the the background is equal to the color input value
		expect(rgbToHex(canvasColorAfter)).toBe(color);
		expect(parseInt(appRendersCount)).toBe(1);
	});
});

function rgbToHex(rgb) {
	const rgbValues = rgb.slice(4, -1).split(", ");
	const hexValues = rgbValues.map(value => {
		const hexString = Number(value).toString(16);
		return hexString.length < 2 ? `0${hexString}` : hexString;
	});
	return `#${hexValues.join("")}`;
}

describe("Can Add a shape from Menu", () => {
	beforeAll(async () => {
		//open a chromium browser
		browser = await puppeteer.launch({ headless: true });
		//open a new page within that browser
		page = await browser.newPage();
		await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
	});
	afterAll(async () => {
		//close the chromium after each test
		await browser.close();
	});

	test("can create a rectangle both in the sidebar and the canvas", async () => {
		// click on the width input and press arrow down to change the menu width value to 74px
		await page.waitForSelector("#root #widthInput");
		await page.click("#root #widthInput");
		await page.keyboard.press("ArrowDown");
		//click the add Shape button
		await page.waitForSelector(
			"#root > .app > .sidebar > .sidebar__menu > button:nth-child(7)"
		);
		await page.click(
			"#root > .app > .sidebar > .sidebar__menu > button:nth-child(7)"
		);
		// get the element in the sideBar list
		const listItem = await page.$(".sidebar__row");
		// get the element at the canvas
		const canvasItem = await page.$(".rect");
		page.waitForSelector(".dsdscdscscddsnkd");
		// get the width of both items
		const widthInListItem = await page.$eval(
			"#shapeWidthInput",
			element => element.value
		);
		const widthInCanvasItem = await page.$eval(
			".rect",
			element => element.style.width
		);

		// ASSERTIONS
		expect(listItem).toBeDefined();
		expect(canvasItem).toBeDefined();
		expect(widthInListItem + "px").toBe(widthInCanvasItem);
	});

	test("can do it without the app, and the sideBar component's rendering", async () => {
		// click on the width input and press arrow down to change the menu width value to 74px
		await page.waitForSelector("#root #widthInput");
		await page.click("#root #widthInput");
		await page.keyboard.press("ArrowDown");
		//click the add Shape button
		await page.waitForSelector(
			"#root > .app > .sidebar > .sidebar__menu > button:nth-child(7)"
		);
		await page.click(
			"#root > .app > .sidebar > .sidebar__menu > button:nth-child(7)"
		);
		// get the element in the sideBar list
		const listItem = await page.$(".sidebar__row");
		// get the element at the canvas
		const canvasItem = await page.$(".rect");
		// get the width of both items
		const widthInListItem = await page.$eval(
			"#shapeWidthInput",
			element => element.value
		);
		const widthInCanvasItem = await page.$eval(
			".rect",
			element => element.style.width
		);

		// ASSERTIONS
		expect(listItem).toBeDefined();
		expect(canvasItem).toBeDefined();
		expect(widthInListItem + "px").toBe(widthInCanvasItem);

		// RECOIL state assertions TESTS
		const appRendersCount = await page.evaluate(
			() => document.querySelector("#app-render").innerText
		);
		const canvasRendersCount = await page.evaluate(
			() => document.querySelector("#canvas-render").innerText
		);
		const sideBarRendersCount = await page.evaluate(
			() => document.querySelector("#sideBar-render").innerText
		);
		const sideBarListRendersCount = await page.evaluate(
			() => document.querySelector("#sideBarList-render").innerText
		);

		expect(parseInt(appRendersCount)).toBe(1);
		expect(parseInt(canvasRendersCount)).toBe(3);
		expect(parseInt(sideBarRendersCount)).toBe(1);
		expect(parseInt(sideBarListRendersCount)).toBe(3);
	});
});

describe("Edit rectangle", () => {
	beforeAll(async () => {
		//open a chromium browser
		browser = await puppeteer.launch({ headless: true });
		//open a new page within that browser
		page = await browser.newPage();
		await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
	});
	afterAll(async () => {
		//close the chromium after each test
		await browser.close();
	});

	test("can edit rectangle in the sidebar and the corresponding rectangle will change in the canvas", async () => {
		//click the add Shape button
		await page.waitForSelector("#add-shape");
		await page.click("#add-shape");
		await page.waitForSelector("#shapeWidthInput");
		await page.click("#shapeWidthInput");
		await page.keyboard.press("ArrowDown");
		// get the element in the sideBar list
		const listItem = await page.$(".sidebar__row");
		const canvasItem = await page.$(".rect");
		const widthInListItem = await page.$eval("#shapeWidthInput", e => e.value);
		const widthInCanvasItem = await page.$eval(".rect", e => e.style.width);
		// ASSERTIONS
		expect(listItem).toBeDefined();
		expect(canvasItem).toBeDefined();
		expect(widthInListItem + "px").toBe(widthInCanvasItem);
	});

	test("can do it with nothing rendering but the rectangle and listItem components", async () => {
		//click the add Shape button
		await page.waitForSelector("#add-shape");
		await page.click("#add-shape");
		await page.waitForSelector("#shapeWidthInput");
		await page.click("#shapeWidthInput");
		await page.keyboard.press("ArrowDown");
		// get the element in the sideBar list
		const listItem = await page.$(".sidebar__row");
		const canvasItem = await page.$(".rect");
		const widthInListItem = await page.$eval("#shapeWidthInput", e => e.value);
		const widthInCanvasItem = await page.$eval(".rect", e => e.style.width);
		// ASSERTIONS
		expect(listItem).toBeDefined();
		expect(canvasItem).toBeDefined();
		expect(widthInListItem + "px").toBe(widthInCanvasItem);

		// RECOIL state assertions TESTS
		const appRendersCount = await page.evaluate(
			() => document.querySelector("#app-render").innerText
		);
		const canvasRendersCount = await page.evaluate(
			() => document.querySelector("#canvas-render").innerText
		);
		const sideBarRendersCount = await page.evaluate(
			() => document.querySelector("#sideBar-render").innerText
		);
		const sideBarListRendersCount = await page.evaluate(
			() => document.querySelector("#sideBarList-render").innerText
		);

		expect(parseInt(appRendersCount)).toBe(1);
		expect(parseInt(canvasRendersCount)).toBe(3);
		expect(parseInt(sideBarRendersCount)).toBe(1);
		expect(parseInt(sideBarListRendersCount)).toBe(3);
	});
});
