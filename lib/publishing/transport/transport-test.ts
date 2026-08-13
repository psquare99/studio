import path from "node:path";

import {
  LocalPublicationTransport,
} from "./local-publication-transport";

const artifactPath =
  path.join(
    process.cwd(),
    "publications",
    "journal",
    "studio-test.json"
  );

const websiteRoot =
  process.env.WEBSITE_PROJECT_PATH;

if (!websiteRoot) {
  throw new Error(
    "WEBSITE_PROJECT_PATH is not set."
  );
}

const transport =
  new LocalPublicationTransport(
    websiteRoot
  );

const destination =
  transport.deliver(
    artifactPath,
    "journal",
    "studio-test"
  );

console.log(
  `Publication delivered to: ${destination}`
);