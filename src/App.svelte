<script>
    // import "carbon-components-svelte/css/all.css";

    import HouseAccounts from "./routes/HouseAccounts.svelte";

    import {
        Styles,
    } from "@sveltestrap/sveltestrap";

    import PgTop from "./components/PgTop.svelte";

    let theme = 'light';

    $effect.pre(() => {
        document.documentElement.setAttribute("theme", theme);
    });
</script>

<main>
    <Styles {theme} />
    <PgTop />

    <HouseAccounts />

</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
