import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mockMode = searchParams.get('mock') === 'true';
  const bypassPassword = searchParams.get('bypass') === 'true';
  
  console.log("🛒 Shopify cart proxy called");
  console.log("🔍 Mock mode:", mockMode);
  console.log("🔓 Bypass password:", bypassPassword);
  
  if (mockMode) {
    console.log("🎭 Returning mock Shopify cart data");
    const mockCart = {
      id: "mock-shopify-cart-" + Date.now(),
      items: [
        {
          title: "Drake Hoodie",
          quantity: 2,
          price: 89.99,
          variant_id: "gid://shopify/ProductVariant/123456789",
          variant_title: "Black / Large",
          product_title: "Drake Official Hoodie",
          handle: "drake-hoodie",
          image: "https://via.placeholder.com/150x150?text=Hoodie"
        },
        {
          title: "Drake T-Shirt",
          quantity: 1,
          price: 45.00,
          variant_id: "gid://shopify/ProductVariant/987654321",
          variant_title: "White / Medium",
          product_title: "Drake Official T-Shirt",
          handle: "drake-tshirt",
          image: "https://via.placeholder.com/150x150?text=T-Shirt"
        }
      ],
      total_price: 224.98,
      currency: "USD",
      checkout_url: "https://your-store.myshopify.com/cart/checkout"
    };
    
    return NextResponse.json(mockCart);
  }

  // Check if Shopify domain is configured
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const shopifyPassword = process.env.SHOPIFY_STORE_PASSWORD;
  
  if (!shopifyDomain) {
    console.error("❌ NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN not configured");
    return NextResponse.json({ 
      error: "Shopify domain not configured", 
      message: "Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable",
      status: 500
    }, { status: 200 });
  }

  // Get cookies from the request
  const cookies = request.headers.get('cookie');
  console.log("🍪 Cookies received:", cookies ? "Yes" : "No");
  
  if (cookies) {
    console.log("🍪 Cookie details:", cookies);
  }

  try {
    // Construct the Shopify cart URL
    const cartUrl = `https://${shopifyDomain}/cart.js`;
    
    console.log("🌐 Fetching from:", cartUrl);
    
    // Enhanced headers to look more like a real browser
    const headers: Record<string, string> = {
      'Cookie': cookies || '',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    // If we have a password, try to authenticate first
    if (shopifyPassword && bypassPassword) {
      console.log("🔐 Attempting password authentication...");
      console.log("🔐 Store domain:", shopifyDomain);
      console.log("🔐 Password provided:", shopifyPassword ? "Yes" : "No");
      
      try {
        // First, try to access the main store to see if we need to authenticate
        console.log("🏪 Accessing main store...");
        const storeResponse = await fetch(`https://${shopifyDomain}`, {
          headers: {
            'User-Agent': headers['User-Agent'],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          redirect: 'follow'
        });
        
        console.log("🏪 Store access status:", storeResponse.status);
        console.log("🏪 Final URL:", storeResponse.url);
        console.log("🏪 Response headers:", Object.fromEntries(storeResponse.headers.entries()));
        
        // If we got redirected to a password page, try to authenticate
        if (storeResponse.url.includes('password') || storeResponse.url.includes('login')) {
          console.log("🔐 Password page detected, attempting authentication...");
          
          // Get the password page to extract any CSRF tokens
          console.log("🔐 Fetching password page for CSRF token...");
          const passwordPageResponse = await fetch(`https://${shopifyDomain}/password`, {
            headers: {
              'User-Agent': headers['User-Agent'],
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cookie': cookies || ''
            }
          });
          
          console.log("🔐 Password page status:", passwordPageResponse.status);
          
          let csrfToken = '';
          if (passwordPageResponse.ok) {
            const passwordPageText = await passwordPageResponse.text();
            console.log("🔐 Password page content length:", passwordPageText.length);
            
            // Try to extract CSRF token from the password page
            const csrfMatch = passwordPageText.match(/name="authenticity_token" value="([^"]+)"/);
            if (csrfMatch) {
              csrfToken = csrfMatch[1];
              console.log("🔐 Found CSRF token:", csrfToken.substring(0, 10) + "...");
            } else {
              console.log("🔐 No CSRF token found in password page");
            }
          }
          
          // Try to submit the password
          const passwordFormData = new URLSearchParams();
          passwordFormData.append('password', shopifyPassword);
          if (csrfToken) {
            passwordFormData.append('authenticity_token', csrfToken);
          }
          
          console.log("🔐 Submitting password form...");
          console.log("🔐 Form data:", passwordFormData.toString());
          
          const authResponse = await fetch(`https://${shopifyDomain}/password`, {
            method: 'POST',
            headers: {
              'User-Agent': headers['User-Agent'],
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Origin': `https://${shopifyDomain}`,
              'Referer': `https://${shopifyDomain}/password`,
              'Cookie': cookies || ''
            },
            body: passwordFormData,
            redirect: 'follow'
          });
          
          console.log("🔐 Authentication response status:", authResponse.status);
          console.log("🔐 Authentication final URL:", authResponse.url);
          console.log("🔐 Authentication response headers:", Object.fromEntries(authResponse.headers.entries()));
          
          // Get any cookies from the authentication response
          const authCookies = authResponse.headers.get('set-cookie');
          if (authCookies) {
            console.log("🍪 Auth cookies received:", authCookies);
            // Add auth cookies to our cart request
            headers['Cookie'] = (headers['Cookie'] ? headers['Cookie'] + '; ' : '') + authCookies;
          } else {
            console.log("🍪 No auth cookies received");
          }
          
          // Check if authentication was successful
          if (!authResponse.url.includes('password') && !authResponse.url.includes('login')) {
            console.log("✅ Authentication successful!");
          } else {
            console.log("❌ Authentication failed - still on password page");
            // Try to get the error message from the response
            try {
              const authResponseText = await authResponse.text();
              console.log("🔐 Auth response content length:", authResponseText.length);
              if (authResponseText.includes('Incorrect password') || authResponseText.includes('wrong password')) {
                console.log("❌ Password was incorrect");
              }
              if (authResponseText.includes('password')) {
                console.log("🔐 Response still contains password form");
              }
            } catch (e) {
              console.log("❌ Could not read authentication response:", e);
            }
          }
        } else {
          console.log("✅ Store accessible without password protection");
        }
        
      } catch (authError) {
        console.log("❌ Authentication attempt failed:", authError);
      }
    } else {
      console.log("🔐 Password bypass conditions not met:");
      console.log("  - Password provided:", !!shopifyPassword);
      console.log("  - Bypass requested:", bypassPassword);
    }

    const response = await fetch(cartUrl, {
      headers,
      redirect: 'follow'
    });
    
    console.log("📡 Response status:", response.status);
    console.log("📡 Response URL:", response.url);
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (response.status === 200) {
      try {
        const responseText = await response.text();
        console.log("📄 Raw response text (first 500 chars):", responseText.substring(0, 500));
        
        // Check if response is HTML (likely a password page)
        if (responseText.trim().startsWith('<!DOCTYPE html>') || responseText.trim().startsWith('<html')) {
          console.log("🔐 Response is HTML - likely password page");
          return NextResponse.json({ 
            error: "Password protection active", 
            message: "Store returned HTML instead of JSON. Password authentication may have failed.",
            status: 403,
            bypassAttempted: bypassPassword,
            hasPassword: !!shopifyPassword,
            responseType: "html"
          }, { status: 200 });
        }
        
        // Try to parse as JSON
        const cartData = JSON.parse(responseText);
        console.log("✅ Cart data received:", cartData);
        return NextResponse.json(cartData);
      } catch (jsonError) {
        console.error("❌ Failed to parse JSON response:", jsonError);
        console.error("❌ Response was not valid JSON");
        return NextResponse.json({ 
          error: "Invalid JSON response from Shopify", 
          status: 500,
          details: "Shopify returned non-JSON data",
          bypassAttempted: bypassPassword,
          hasPassword: !!shopifyPassword
        }, { status: 200 });
      }
    } else if (response.status === 302 || response.status === 301) {
      console.log("🔄 Redirect received - checking if it's password protection");
      
      const location = response.headers.get('location');
      console.log("📍 Redirect location:", location);
      
      if (location && (location.includes('password') || location.includes('login'))) {
        console.log("🔐 Password protection confirmed");
        return NextResponse.json({ 
          error: "Password protection active", 
          message: "Store is password protected. Use mock mode for testing or provide password in SHOPIFY_STORE_PASSWORD.",
          status: 403,
          bypassAttempted: bypassPassword,
          hasPassword: !!shopifyPassword
        }, { status: 200 });
      } else {
        console.log("🔄 Other redirect - no valid session");
        return NextResponse.json({ 
          error: "No valid Shopify session", 
          message: "Please visit your Shopify store first to create a session",
          status: 302 
        }, { status: 200 });
      }
    } else if (response.status === 403) {
      console.log("🚫 Access forbidden - likely password protection");
      return NextResponse.json({ 
        error: "Access forbidden", 
        message: "Store may be password protected or require authentication",
        status: 403
      }, { status: 200 });
    } else {
      console.log("❌ Unexpected status:", response.status);
      let errorText = "";
      try {
        errorText = await response.text();
        console.log("❌ Error response:", errorText);
      } catch {
        console.log("❌ Could not read error response text");
        errorText = "Unable to read response";
      }
      
      return NextResponse.json({ 
        error: "Failed to fetch cart", 
        status: response.status,
        details: errorText 
      }, { status: 200 });
    }
    
  } catch (error) {
    console.error("❌ Error fetching Shopify cart:", error);
    return NextResponse.json({ 
      error: "Network error", 
      details: error instanceof Error ? error.message : "Unknown error",
      status: 500
    }, { status: 200 });
  }
} 