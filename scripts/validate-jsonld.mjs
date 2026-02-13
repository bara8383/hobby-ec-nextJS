import {
  createItemListJsonLd,
  createProductJsonLd,
  createWebSiteJsonLd
} from "./structured-data.mjs";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateWebSite(data) {
  assert(data["@context"] === "https://schema.org", "WebSite: @context is invalid");
  assert(data["@type"] === "WebSite", "WebSite: @type is invalid");
  assert(typeof data.name === "string" && data.name.length > 0, "WebSite: name is required");
  assert(typeof data.url === "string" && /^https?:\/\//.test(data.url), "WebSite: url is invalid");
}

function validateItemList(data) {
  assert(data["@context"] === "https://schema.org", "ItemList: @context is invalid");
  assert(data["@type"] === "ItemList", "ItemList: @type is invalid");
  assert(Array.isArray(data.itemListElement) && data.itemListElement.length > 0, "ItemList: itemListElement is required");

  data.itemListElement.forEach((item, index) => {
    assert(item["@type"] === "ListItem", `ItemList[${index}]: @type is invalid`);
    assert(Number.isInteger(item.position) && item.position >= 1, `ItemList[${index}]: position is invalid`);
    assert(typeof item.url === "string" && /^https?:\/\//.test(item.url), `ItemList[${index}]: url is invalid`);
    assert(typeof item.name === "string" && item.name.length > 0, `ItemList[${index}]: name is required`);
  });
}

function validateProduct(data) {
  assert(data["@context"] === "https://schema.org", "Product: @context is invalid");
  assert(data["@type"] === "Product", "Product: @type is invalid");
  assert(typeof data.name === "string" && data.name.length > 0, "Product: name is required");
  assert(typeof data.description === "string" && data.description.length > 0, "Product: description is required");
  assert(typeof data.sku === "string" && data.sku.length > 0, "Product: sku is required");
  assert(typeof data.image === "string" && /^https?:\/\//.test(data.image), "Product: image is invalid");

  const offers = data.offers || {};
  assert(offers["@type"] === "Offer", "Product: offers.@type is invalid");
  assert(offers.priceCurrency === "JPY", "Product: offers.priceCurrency is invalid");
  assert(typeof offers.price === "number" && offers.price > 0, "Product: offers.price is invalid");
  assert(offers.availability === "https://schema.org/InStock", "Product: offers.availability is invalid");
  assert(typeof offers.url === "string" && /^https?:\/\//.test(offers.url), "Product: offers.url is invalid");
}

const sampleProduct = {
  id: "sample-1",
  title: "Sample Product",
  description: "Schema validation sample",
  image: "https://example.com/sample.jpg",
  price: 1200
};

const checks = [
  ["WebSite", () => validateWebSite(createWebSiteJsonLd())],
  ["ItemList", () => validateItemList(createItemListJsonLd([sampleProduct]))],
  ["Product", () => validateProduct(createProductJsonLd(sampleProduct))]
];

let failed = false;
for (const [name, validate] of checks) {
  try {
    validate();
    console.log(`✅ ${name} JSON-LD validation passed`);
  } catch (error) {
    failed = true;
    console.error(`❌ ${name} JSON-LD validation failed`);
    console.error(error instanceof Error ? error.message : error);
  }
}

if (failed) {
  process.exit(1);
}
