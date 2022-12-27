# WA-Sno-Park README

I originally sketched this out as an idea to show the latest webcam shot for the sno-park, thinking that might be available, and would be a quick way to judge how busy/ready-to-ski each park is.

Instead, this is turning into more of a handy website to consult the morning-of. What was groomed recently, is it worth the drive, is the drive a lot longer than typical, etc.

What it might be good for:

- current drive-time to each park
- see how many miles are available
- filter by day-last-groomed
- filter by groomed/ungroomed
- ???

## Live in Washington and want to help?

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### API dependencies

1. Openweathermap
2. Google Maps

Get your API keys and put 'em in a `.env.development` file when working locally:

```env
NEXT_PUBLIC_OPENWEATHER_GEO_API_KEY=xxxx
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=xxxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxxx-xxxx
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Then, hit up your browser.


## TODO

[] Add each park to list
[] Surface schedule for grooming
[] Surface amount of trails/groomed trails
[] Store location in localStorage to prevent asking too much
[] Set home address?
[] Ability to *pin* sno-parks to top of page

## Major Todo

[] store weather at server-level, 30 min?