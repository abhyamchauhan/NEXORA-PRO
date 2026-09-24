// Offline preview: renders the order-confirmation email with sample data and
// writes the HTML to stdout. Run: npx tsx scripts/email-preview.ts > preview.html
import { renderOrderEmailHTML, sampleOrderEmailData } from "../src/lib/email-template";

process.stdout.write(renderOrderEmailHTML(sampleOrderEmailData()));
