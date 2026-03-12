import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  await prisma.endpoint.deleteMany();
  await prisma.project.deleteMany();

  // ─── Project 1: E-Commerce API ───────────────────────────────────────────────
  const ecommerce = await prisma.project.create({
    data: {
      name: "E-Commerce API",
      description:
        "Mock backend for an online store — products, cart, and orders.",
      endpoints: {
        create: [
          {
            path: "/products",
            method: "GET",
            latencyMs: 120,
            errorRate: 0.0,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                data: [
                  {
                    id: "prod_001",
                    name: "Wireless Noise-Cancelling Headphones",
                    price: 299.99,
                    currency: "USD",
                    category: "Electronics",
                    inStock: true,
                    rating: 4.7,
                    reviews: 1842,
                    imageUrl: "https://picsum.photos/seed/headphones/400/300",
                  },
                  {
                    id: "prod_002",
                    name: "Ergonomic Mechanical Keyboard",
                    price: 149.99,
                    currency: "USD",
                    category: "Peripherals",
                    inStock: true,
                    rating: 4.5,
                    reviews: 963,
                    imageUrl: "https://picsum.photos/seed/keyboard/400/300",
                  },
                  {
                    id: "prod_003",
                    name: "4K Ultra-Wide Monitor",
                    price: 749.0,
                    currency: "USD",
                    category: "Displays",
                    inStock: false,
                    rating: 4.9,
                    reviews: 512,
                    imageUrl: "https://picsum.photos/seed/monitor/400/300",
                  },
                ],
                total: 3,
                page: 1,
                pageSize: 10,
              },
              null,
              2
            ),
          },
          {
            path: "/products/:id",
            method: "GET",
            latencyMs: 80,
            errorRate: 0.05,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                id: "prod_001",
                name: "Wireless Noise-Cancelling Headphones",
                description:
                  "Industry-leading noise cancellation with 30-hour battery life and premium sound quality.",
                price: 299.99,
                currency: "USD",
                category: "Electronics",
                tags: ["wireless", "audio", "noise-cancelling"],
                inStock: true,
                stockCount: 47,
                rating: 4.7,
                reviews: 1842,
                variants: [
                  { color: "Midnight Black", sku: "HDR-001-BLK" },
                  { color: "Platinum Silver", sku: "HDR-001-SLV" },
                ],
              },
              null,
              2
            ),
          },
          {
            path: "/cart",
            method: "POST",
            latencyMs: 200,
            errorRate: 0.1,
            active: true,
            enableCors: true,
            requireAuth: true,
            customAuthHeader: "Bearer mock_user_token_abc123",
            responseBody: JSON.stringify(
              {
                cartId: "cart_xK9mP2",
                userId: "usr_0042",
                items: [
                  {
                    productId: "prod_001",
                    quantity: 1,
                    unitPrice: 299.99,
                  },
                ],
                subtotal: 299.99,
                tax: 24.0,
                total: 323.99,
                currency: "USD",
                updatedAt: "2024-11-15T10:30:00Z",
              },
              null,
              2
            ),
          },
          {
            path: "/orders",
            method: "POST",
            latencyMs: 450,
            errorRate: 0.15,
            active: true,
            enableCors: true,
            requireAuth: true,
            customAuthHeader: "Bearer mock_user_token_abc123",
            responseBody: JSON.stringify(
              {
                orderId: "ord_88fZ2kL",
                status: "confirmed",
                estimatedDelivery: "2024-11-19",
                items: [
                  {
                    productId: "prod_001",
                    name: "Wireless Noise-Cancelling Headphones",
                    quantity: 1,
                    price: 299.99,
                  },
                ],
                total: 323.99,
                paymentMethod: "credit_card",
                shippingAddress: {
                  line1: "123 Developer Lane",
                  city: "San Francisco",
                  state: "CA",
                  zip: "94107",
                  country: "US",
                },
              },
              null,
              2
            ),
          },
        ],
      },
    },
  });

  // ─── Project 2: Auth Service ─────────────────────────────────────────────────
  const authService = await prisma.project.create({
    data: {
      name: "Auth Service",
      description:
        "Mock authentication and authorization service with JWT flows.",
      endpoints: {
        create: [
          {
            path: "/auth/register",
            method: "POST",
            latencyMs: 300,
            errorRate: 0.0,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                success: true,
                user: {
                  id: "usr_0099",
                  email: "jane.doe@example.com",
                  username: "janedoe",
                  createdAt: "2024-11-15T09:00:00Z",
                },
                message: "Account created successfully. Please verify your email.",
              },
              null,
              2
            ),
          },
          {
            path: "/auth/login",
            method: "POST",
            latencyMs: 180,
            errorRate: 0.05,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                success: true,
                accessToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMDA0MiIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.mock_signature",
                refreshToken: "rt_9fX3mK7pQ2sL1vN8wD5cR4yU6iO0bA",
                expiresIn: 3600,
                tokenType: "Bearer",
                user: {
                  id: "usr_0042",
                  email: "user@example.com",
                  username: "devuser",
                  role: "admin",
                },
              },
              null,
              2
            ),
          },
          {
            path: "/auth/me",
            method: "GET",
            latencyMs: 60,
            errorRate: 0.0,
            active: true,
            enableCors: true,
            requireAuth: true,
            customAuthHeader: "Bearer mock_user_token_abc123",
            responseBody: JSON.stringify(
              {
                id: "usr_0042",
                email: "user@example.com",
                username: "devuser",
                role: "admin",
                plan: "pro",
                createdAt: "2024-01-10T08:00:00Z",
                lastLoginAt: "2024-11-15T09:30:00Z",
              },
              null,
              2
            ),
          },
          {
            path: "/auth/logout",
            method: "POST",
            latencyMs: 100,
            errorRate: 0.0,
            active: true,
            enableCors: true,
            requireAuth: true,
            customAuthHeader: "Bearer mock_user_token_abc123",
            responseBody: JSON.stringify(
              {
                success: true,
                message: "Logged out successfully.",
              },
              null,
              2
            ),
          },
          {
            path: "/auth/refresh",
            method: "POST",
            latencyMs: 150,
            errorRate: 0.02,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                accessToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMDA0MiIsImlhdCI6MTcwMDAwMzYwMCwiZXhwIjoxNzAwMDkwMDAwfQ.refreshed_mock_signature",
                expiresIn: 3600,
                tokenType: "Bearer",
              },
              null,
              2
            ),
          },
        ],
      },
    },
  });

  // ─── Project 3: Blog & CMS API ───────────────────────────────────────────────
  const blogApi = await prisma.project.create({
    data: {
      name: "Blog & CMS API",
      description:
        "Mock content management endpoints for posts, authors, and tags.",
      endpoints: {
        create: [
          {
            path: "/posts",
            method: "GET",
            latencyMs: 90,
            errorRate: 0.0,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                posts: [
                  {
                    id: "post_001",
                    title: "Getting Started with API Mocking",
                    slug: "getting-started-api-mocking",
                    excerpt:
                      "Learn how mock APIs can dramatically speed up your frontend development workflow.",
                    author: { id: "auth_01", name: "Alice Chen", avatar: "https://i.pravatar.cc/150?u=alice" },
                    tags: ["api", "frontend", "developer-tools"],
                    publishedAt: "2024-11-10T12:00:00Z",
                    readTimeMinutes: 5,
                  },
                  {
                    id: "post_002",
                    title: "Simulating Network Latency for Realistic UX Testing",
                    slug: "simulating-network-latency",
                    excerpt:
                      "Real users don't have instant connections. Here's how to test your UI under pressure.",
                    author: { id: "auth_02", name: "Bob Martinez", avatar: "https://i.pravatar.cc/150?u=bob" },
                    tags: ["ux", "testing", "performance"],
                    publishedAt: "2024-11-12T14:00:00Z",
                    readTimeMinutes: 8,
                  },
                ],
                total: 2,
                page: 1,
              },
              null,
              2
            ),
          },
          {
            path: "/posts/:slug",
            method: "GET",
            latencyMs: 100,
            errorRate: 0.0,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                id: "post_001",
                title: "Getting Started with API Mocking",
                slug: "getting-started-api-mocking",
                content:
                  "# Getting Started with API Mocking\n\nAPI mocking is a technique that allows frontend developers to simulate backend responses without needing a real server...",
                author: {
                  id: "auth_01",
                  name: "Alice Chen",
                  bio: "Senior Frontend Engineer & DX advocate.",
                  avatar: "https://i.pravatar.cc/150?u=alice",
                },
                tags: ["api", "frontend", "developer-tools"],
                publishedAt: "2024-11-10T12:00:00Z",
                updatedAt: "2024-11-11T09:00:00Z",
                readTimeMinutes: 5,
                views: 2341,
              },
              null,
              2
            ),
          },
          {
            path: "/posts",
            method: "POST",
            latencyMs: 250,
            errorRate: 0.08,
            active: true,
            enableCors: true,
            requireAuth: true,
            customAuthHeader: "Bearer mock_cms_admin_token",
            responseBody: JSON.stringify(
              {
                id: "post_003",
                title: "Your New Post Title",
                slug: "your-new-post-title",
                status: "draft",
                createdAt: "2024-11-15T10:00:00Z",
              },
              null,
              2
            ),
          },
          {
            path: "/posts/:id",
            method: "DELETE",
            latencyMs: 150,
            errorRate: 0.0,
            active: true,
            enableCors: true,
            requireAuth: true,
            customAuthHeader: "Bearer mock_cms_admin_token",
            responseBody: JSON.stringify(
              {
                success: true,
                message: "Post deleted successfully.",
                deletedId: "post_001",
              },
              null,
              2
            ),
          },
        ],
      },
    },
  });

  // ─── Project 4: Weather & Geo API ───────────────────────────────────────────
  const weatherApi = await prisma.project.create({
    data: {
      name: "Weather & Geo API",
      description:
        "Mock weather data and geocoding service for location-based apps.",
      endpoints: {
        create: [
          {
            path: "/weather/current",
            method: "GET",
            latencyMs: 200,
            errorRate: 0.12,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                location: {
                  city: "San Francisco",
                  region: "California",
                  country: "US",
                  lat: 37.7749,
                  lon: -122.4194,
                  timezone: "America/Los_Angeles",
                },
                current: {
                  tempC: 16.4,
                  tempF: 61.5,
                  feelsLikeC: 14.1,
                  humidity: 78,
                  windKph: 22,
                  windDir: "WSW",
                  conditionText: "Partly Cloudy",
                  conditionIcon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                  uvIndex: 4,
                  visibilityKm: 16,
                },
                updatedAt: "2024-11-15T10:00:00Z",
              },
              null,
              2
            ),
          },
          {
            path: "/weather/forecast",
            method: "GET",
            latencyMs: 350,
            errorRate: 0.08,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                location: { city: "San Francisco", country: "US" },
                forecast: [
                  { date: "2024-11-15", maxC: 18, minC: 12, conditionText: "Partly Cloudy", precipitationMm: 0 },
                  { date: "2024-11-16", maxC: 20, minC: 13, conditionText: "Sunny", precipitationMm: 0 },
                  { date: "2024-11-17", maxC: 15, minC: 10, conditionText: "Moderate Rain", precipitationMm: 8.4 },
                  { date: "2024-11-18", maxC: 14, minC: 9, conditionText: "Heavy Rain", precipitationMm: 22.1 },
                  { date: "2024-11-19", maxC: 17, minC: 11, conditionText: "Cloudy", precipitationMm: 1.2 },
                ],
              },
              null,
              2
            ),
          },
          {
            path: "/geo/search",
            method: "GET",
            latencyMs: 150,
            errorRate: 0.05,
            active: true,
            enableCors: true,
            requireAuth: false,
            responseBody: JSON.stringify(
              {
                query: "San Francisco",
                results: [
                  {
                    id: "geo_001",
                    name: "San Francisco",
                    region: "California",
                    country: "United States",
                    lat: 37.7749,
                    lon: -122.4194,
                  },
                  {
                    id: "geo_002",
                    name: "San Francisco de Macorís",
                    region: "Duarte Province",
                    country: "Dominican Republic",
                    lat: 19.3009,
                    lon: -70.2518,
                  },
                ],
              },
              null,
              2
            ),
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded 4 projects:`);
  console.log(`   📦 ${ecommerce.name} — 4 endpoints`);
  console.log(`   🔐 ${authService.name} — 5 endpoints`);
  console.log(`   📝 ${blogApi.name} — 4 endpoints`);
  console.log(`   🌤️  ${weatherApi.name} — 3 endpoints`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
