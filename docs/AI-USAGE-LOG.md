# AI Usage Log

## Purpose

This document records how AI-assisted development was used during the
Government Services Copilot project.

AI was treated as a development accelerator and review assistant, not as an
authority for government policy or project requirements.

## Architecture

AI assistance was used to:

- brainstorm architecture options
- compare Clean/Hexagonal architecture approaches
- identify application ports and infrastructure adapters
- review dependency boundaries
- identify missing rubric requirements

Final architecture decisions were reviewed against the assignment requirements.

## Implementation

AI assistance was used for:

- TypeScript scaffolding
- domain type suggestions
- application use-case structure
- test scaffolding
- HTTP endpoint examples
- SQLite repository implementation
- document ingestion components
- DOCX export implementation

Generated code was executed locally and corrected where necessary.

## Evaluation

AI assistance was used to generate candidate golden-set questions covering:

- normal in-corpus questions
- out-of-corpus questions
- ambiguous requests
- prompt injection
- conflicting information

The final evaluation dataset was reviewed to ensure that the expected behavior
matched the available corpus.

## Security

AI assistance was used as a review aid for identifying:

- prompt injection risks
- unsupported answer risks
- sensitive-data risks
- excessive agency risks
- unbounded workflow risks

Security decisions were implemented and tested in the repository.

## Documentation

AI assistance was used to draft and improve:

- architecture documentation
- evaluation documentation
- security documentation
- agentic workflow documentation
- README sections
- demo explanations

Documentation was checked against the actual implementation.

## Human Review

The following principles were followed:

1. Generated code was not accepted without local verification.
2. Tests were run after significant changes.
3. Requirements were checked against the BRD.
4. AI-generated government facts were not treated as authoritative.
5. Source evidence remains the authority for citizen-service answers.
6. Known MVP limitations are explicitly documented.

## Known AI Limitations

AI-generated suggestions can:

- assume files exist when they do not
- suggest APIs that are not implemented
- overestimate feature completeness
- produce incorrect technical details

For this reason, repository state, compiler output, tests, and actual runtime
behavior were used as the source of truth.

## Summary

AI accelerated implementation and documentation while human review, tests, and
repository evidence remained the final validation mechanisms.