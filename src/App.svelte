<script lang="ts">
    import DropZone from "./components/DropZone.svelte";
    import { parse } from "./utils/png";

    let positive = "";
    let negative = "";
    let metadata = "";

    const NEGATIVE_START = "Negative prompt: ";
    const METADATA_START = "Steps: ";

    async function getInfo(
        file: File
    ): Promise<[string[], string[], string[]]> {
        // Prepare
        const buffer = await file.arrayBuffer();
        const chunks = parse(new Uint8Array(buffer));

        // Decode text
        const decoder = new TextDecoder("utf8");
        const parameters = chunks
            .filter((chunk) => chunk.type === "tEXt" || chunk.type === "iTXt")
            .map(({ payload }) => decoder.decode(payload))
            .filter((text) => text.startsWith("parameters"))[0]
            .split("\x00")
            .flatMap((item) => item.split("\n"))
            .filter((item) => item !== "");

        // Select with ref
        const positive = [];
        const negative = [];
        const metadata = [];
        let ref = positive;

        // Remove "parameters"
        parameters.shift();

        // Check fields
        for (let parameter of parameters) {
            if (parameter.startsWith(METADATA_START)) ref = metadata;
            if (parameter.startsWith(NEGATIVE_START)) {
                ref = negative;
                ref.push(parameter.slice(NEGATIVE_START.length));
            } else {
                ref.push(parameter);
            }
        }

        // Retrun results
        return [positive, negative, metadata];
    }

    async function handleFileDrop(files: FileList) {
        if (files.length !== 1) return;
        [positive, negative, metadata] = (await getInfo(files[0])).map((item) =>
            item.join("\n")
        );
    }
</script>

<main>
    <h1>pnginfo</h1>
    <DropZone onFileDrop={handleFileDrop} />
    <div class="">
        <span class="label">Positive Prompt</span>
        <div class="prompt">{positive}</div>
    </div>
    <div class="">
        <span class="label">Negative Prompt</span>
        <div class="prompt">{negative}</div>
    </div>
    <div class="">
        <span class="label">Metadata</span>
        <div class="prompt">{metadata}</div>
    </div>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
        gap: 20px;
        color: #f0f0f0;
        font-size: 1.2rem;
    }

    h1 {
        font-size: 3rem;
        font-weight: bold;
    }

    div {
        display: flex;
        flex-direction: column;

        .label {
            font-size: 1rem;
        }

        .prompt {
            min-height: 100px;
            padding: 6px 12px;
            border: 2px solid #f0f0f0;
            word-break: break-word;
            white-space: pre-wrap;
        }
    }
</style>
