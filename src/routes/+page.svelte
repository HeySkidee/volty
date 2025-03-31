<script lang="ts">
    import { Chat } from "@ai-sdk/svelte";
    import { onMount } from "svelte";

    const chat = new Chat();
    let userIP = "Gathering the address...";

    interface DeviceInfo {
        os?: string;
        screenResolution?: string;
        browserName?: string;
        browserVersion?: string;
        language?: string;
        onlineStatus?: boolean;
        cookiesEnabled?: boolean;
        javascriptEnabled: boolean;
        timeZone?: string;
        connectionType?: string;
        batteryLevel?: number;
        charging?: boolean;
        maxTouchPoints?: number;
        cores?: number;
        memory?: number;
        vendor?: string;
        platform?: string;
        darkMode?: boolean;
    }

    let deviceInfo: DeviceInfo = {
        javascriptEnabled: true,
    };

    let bootTime = new Date();
    let currentTime = new Date();

    onMount(() => {
        const timer = setInterval(() => {
            currentTime = new Date();
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    });

    onMount(async () => {
        // os and browser
        const userAgent = navigator.userAgent;
        const browserData = userAgent.match(
            /(Chrome|Firefox|Safari|Opera|MSIE|Trident)\/?\s*([0-9]+(\.[0-9]+)?)/i
        );

        if (browserData) {
            deviceInfo.browserName = browserData[1];
            deviceInfo.browserVersion = browserData[2];
        }

        deviceInfo.os = navigator.platform;
        deviceInfo.screenResolution = `${window.screen.width}x${window.screen.height}`;
        deviceInfo.language = navigator.language;
        deviceInfo.onlineStatus = navigator.onLine;
        deviceInfo.cookiesEnabled = navigator.cookieEnabled;
        deviceInfo.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if ("connection" in navigator) {
            const connection = (navigator as any).connection;
            deviceInfo.connectionType = connection.effectiveType || "unknown";
        }

        if ("getBattery" in navigator) {
            const battery = await (navigator as any).getBattery();
            deviceInfo.batteryLevel = battery.level * 100;
            deviceInfo.charging = battery.charging;

            battery.addEventListener("chargingchange", () => {
                deviceInfo.charging = battery.charging;
            });
            battery.addEventListener("levelchange", () => {
                deviceInfo.batteryLevel = battery.level * 100;
            });
        }

        deviceInfo.cores = navigator.hardwareConcurrency;
        deviceInfo.memory = (navigator as any).deviceMemory;
        deviceInfo.vendor = (navigator as any).vendor;
        deviceInfo.maxTouchPoints = navigator.maxTouchPoints;
        deviceInfo.platform = navigator.platform;
        deviceInfo.darkMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        try {
            const response = await fetch("/api/ip");
            const data = await response.json();
            userIP = data.ip;
        } catch (error) {
            userIP = "Failed to load node address";
        }
    });
</script>

<main
    class="h-screen w-screen text-[#F8F8F8] flex flex-col items-center justify-center"
>
    <div
        class="border-2 border-[#2E2E2E] w-[95%] h-[90%] flex flex-col items-center justify-center"
    >
        <!-- top bar -->
        <div
            class="border-[#2E2E2E] border-b-2 w-full min-h-50 px-4 flex items-center justify-between"
        >
            <img
                src="https://64.media.tumblr.com/4b6124c2fc8f5b4c8229da00f5b79f25/f091c430573b31e1-c3/s540x810/eba6e1f128e073fb66e3ea9f89993f7e0cd2f2ef.gifv"
                alt="pfp"
                class="w-52 mt-3 md:mt-1"
            />
            <div class="hidden w-[210px] mr-3.5 text-right sm:block">
                <p class="font-['DS-Digital'] text-6xl tracking-wider text-left">
                    {currentTime.toLocaleTimeString("en-US", { hour12: false })}
                </p>
                <span class="text-neutral-400 mr-1">
                    SYNC_REGION: {deviceInfo.timeZone}
                </span>
            </div>
        </div>

        <!-- Split screens -->
        <div class="mt-auto w-[100%] flex flex-col md:flex-row h-[75%]">
            <!-- left -->
            <div
                class="w-full min-h-[100%] overflow-y-auto border-r-0 md:border-b-0 md:border-r border-[#2E2E2E] md:w-4/5"
            >
                <ul class="px-2 pt-1.5 -z-10">
                    <li>
                        {`~ [SYSTEM] boot seq initiated at ${bootTime.toLocaleTimeString()}`}
                    </li>
                    <li class="flex items-center">
                        {`~ [SYSTEM] Connection synced. Awaiting input`}
                        <div
                            class="ml-1.5 mt-1 rounded-full size-2 animate-pulse bg-neutral-700"
                        ></div>
                    </li>

                    {#each chat.messages as message}
                        <li>
                            {#if message.role === "user"}
                                <span class="mr-1 font-bold">{`>`}</span>
                                {message.content}
                            {:else}
                                <span class="mr-1 font-bold">~</span>
                                {message.content}
                            {/if}
                        </li>
                    {/each}
                </ul>
                <form
                    onsubmit={chat.handleSubmit}
                    class="w-full mt-2 sticky bottom-0 bg-[#0F1214]"
                >
                    <div class="flex w-full border-t-2 border-[#2E2E2E] px-2 pb-2 pt-1">
                        <p class="mr-1 font-bold">{`> `}</p>
                        <input
                            bind:value={chat.input}
                            placeholder="Whats on your mind anon..."
                            class="w-full focus:outline-none"
                        />
                    </div>
                    <button type="submit" class="hidden">Send</button>
                </form>
            </div>

            <!-- right -->
            <div class="w-full border border-[#2E2E2E] min-h-[100%] overflow-y-auto px-4 md:w-90 md:border-0" >
                <div class="py-4">
                    <h2 class="text-xl font-bold mb-4">
                        [SYS_DIAGNOSTICS_v1.0]
                    </h2>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between border-b border-[#2E2E2E] pb-2" >
                            <span class="text-neutral-400" >
                                NEURAL_LINK_STATUS:</span >
                            <span class="flex items-center gap-1">
                                {deviceInfo.onlineStatus
                                    ? "CONNECTED"
                                    : "OFFLINE"}
                                <div 
                                    class={`rounded-full animate-pulse w-2 h-2 ${deviceInfo.onlineStatus ? "bg-green-500" : "bg-red-500"}`}
                                ></div>
                            </span>
                        </div>

                        <div class="flex justify-between">
                            <span class="text-neutral-400">NODE_ADDRESS:</span>
                            <span class="text-green-400">{userIP}</span>
                        </div>
                        {#if deviceInfo.connectionType}
                            <div class="flex justify-between">
                                <span class="text-neutral-400">NET_TYPE:</span>
                                <span>{deviceInfo.connectionType}</span>
                            </div>
                        {/if}

                        {#if deviceInfo.os}
                            <div class="flex justify-between mt-4 border-t border-[#2E2E2E] pt-2" >
                                <span class="text-neutral-400">
                                    OPERATING_SYSTEM:
                                </span>
                                <span>{deviceInfo.os}</span>
                            </div>
                        {/if}
                        {#if deviceInfo.cores}
                            <div class="flex justify-between">
                                <span class="text-neutral-400">CPU_CORES:</span>
                                <span>{deviceInfo.cores}</span>
                            </div>
                        {/if}
                        {#if deviceInfo.memory}
                            <div class="flex justify-between">
                                <span class="text-neutral-400">MEMORY_GB:</span>
                                <span>{deviceInfo.memory}</span>
                            </div>
                        {/if}
                        {#if deviceInfo.vendor}
                            <div class="flex justify-between">
                                <span class="text-neutral-400">VENDOR:</span>
                                <span>{deviceInfo.vendor}</span>
                            </div>
                        {/if}

                        {#if deviceInfo.timeZone}
                            <div class="flex justify-between mt-4 border-t border-[#2E2E2E] pt-2" >
                                <span class="text-neutral-400">TIME_ZONE:</span>
                                <span>{deviceInfo.timeZone}</span>
                            </div>
                        {/if}
                        {#if deviceInfo.language}
                            <div class="flex justify-between">
                                <span class="text-neutral-400">LOCALE:</span>
                                <span>{deviceInfo.language}</span>
                            </div>
                        {/if}
                        <div class="flex justify-between">
                            <span class="text-neutral-400">DISPLAY_MODE:</span>
                            <span>{deviceInfo.darkMode ? "DARK" : "LIGHT"}</span
                            >
                        </div>

                        {#if deviceInfo.screenResolution}
                            <div class="flex justify-between mt-4 border-t border-[#2E2E2E] pt-2" >
                                <span class="text-neutral-400">
                                    OPTICAL_RESOLUTION:
                                </span>
                                <span>{deviceInfo.screenResolution}</span>
                            </div>
                        {/if}
                        <div class="flex justify-between">
                            <span class="text-neutral-400">TOUCH_POINTS:</span>
                            <span>{deviceInfo.maxTouchPoints || 0}</span>
                        </div>
                        {#if deviceInfo.batteryLevel !== undefined}
                            <div class="flex justify-between">
                                <span class="text-neutral-400">
                                    POWER_LEVEL:
                                </span>
                                <span
                                    class={deviceInfo.charging
                                        ? "text-green-400"
                                        : ""}
                                >
                                    {deviceInfo.batteryLevel.toFixed(0)}%
                                    {deviceInfo.charging ? "[CHARGING]" : ""}
                                </span>
                            </div>
                        {/if}

                        {#if deviceInfo.browserName}
                            <div class="flex justify-between mt-4 border-t border-[#2E2E2E] pt-2" >
                                <span class="text-neutral-400">
                                    BROWSER_AGENT:
                                </span>
                                <span>
                                    {deviceInfo.browserName}
                                    {deviceInfo.browserVersion}
                                </span>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
