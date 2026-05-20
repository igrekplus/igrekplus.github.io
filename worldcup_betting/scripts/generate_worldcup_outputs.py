from __future__ import annotations

import csv
import json
from dataclasses import dataclass, field
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANUAL_DIR = ROOT / "data" / "manual"
GENERATED_DIR = ROOT / "generated"
GROUPS = list("ABCDEFGHIJKL")
FLAG_CODE_BY_TEAM_ID = {
    "MEX": "mx",
    "RSA": "za",
    "KOR": "kr",
    "CZE": "cz",
    "CAN": "ca",
    "SUI": "ch",
    "QAT": "qa",
    "BIH": "ba",
    "BRA": "br",
    "MAR": "ma",
    "HAI": "ht",
    "SCO": "sct",
    "USA": "us",
    "PAR": "py",
    "AUS": "au",
    "TUR": "tr",
    "GER": "de",
    "CUW": "cw",
    "CIV": "ci",
    "ECU": "ec",
    "NED": "nl",
    "JPN": "jp",
    "TUN": "tn",
    "SWE": "se",
    "BEL": "be",
    "EGY": "eg",
    "IRN": "ir",
    "NZL": "nz",
    "ESP": "es",
    "CPV": "cv",
    "KSA": "sa",
    "URU": "uy",
    "FRA": "fr",
    "SEN": "sn",
    "NOR": "no",
    "IRQ": "iq",
    "ARG": "ar",
    "ALG": "dz",
    "AUT": "at",
    "JOR": "jo",
    "POR": "pt",
    "UZB": "uz",
    "COL": "co",
    "COD": "cd",
    "ENG": "eng",
    "CRO": "hr",
    "GHA": "gh",
    "PAN": "pa",
}


@dataclass
class TeamStats:
    team_id: str
    name: str
    group: str
    slot: str
    played: int = 0
    wins: int = 0
    draws: int = 0
    losses: int = 0
    goals_for: int = 0
    goals_against: int = 0
    points: int = 0

    @property
    def goal_diff(self) -> int:
        return self.goals_for - self.goals_against

    def as_dict(self) -> dict[str, object]:
        return {
            "team_id": self.team_id,
            "name": self.name,
            "group": self.group,
            "played": self.played,
            "wins": self.wins,
            "draws": self.draws,
            "losses": self.losses,
            "goals_for": self.goals_for,
            "goals_against": self.goals_against,
            "goal_diff": self.goal_diff,
            "points": self.points,
        }


@dataclass
class Match:
    match_id: str
    stage: str
    group: str
    home: str
    away: str
    kickoff_jst: str
    kickoff_local: str
    local_timezone: str
    venue: str
    home_score: int | None
    away_score: int | None
    home_et_score: int | None
    away_et_score: int | None
    home_pk_score: int | None
    away_pk_score: int | None


def blank_to_none(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value if value else None


def to_int(value: str | None) -> int | None:
    if value is None:
        return None
    value = value.strip()
    return int(value) if value else None


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def load_teams() -> dict[str, dict[str, str]]:
    rows = read_csv(MANUAL_DIR / "teams.csv")
    return {row["team_id"]: row for row in rows}


def load_matches() -> list[Match]:
    matches = []
    for row in read_csv(MANUAL_DIR / "matches.csv"):
        matches.append(
            Match(
                match_id=row["match_id"],
                stage=row["stage"],
                group=row["group"],
                home=row["home"],
                away=row["away"],
                kickoff_jst=blank_to_none(row["kickoff_jst"]) or "",
                kickoff_local=blank_to_none(row["kickoff_local"]) or "",
                local_timezone=blank_to_none(row["local_timezone"]) or "",
                venue=blank_to_none(row["venue"]) or "",
                home_score=to_int(row["home_score"]),
                away_score=to_int(row["away_score"]),
                home_et_score=to_int(row["home_et_score"]),
                away_et_score=to_int(row["away_et_score"]),
                home_pk_score=to_int(row["home_pk_score"]),
                away_pk_score=to_int(row["away_pk_score"]),
            )
        )
    return matches


def has_regular_score(match: Match) -> bool:
    return match.home_score is not None and match.away_score is not None


def sort_stats(stats: list[TeamStats]) -> list[TeamStats]:
    return sorted(
        stats,
        key=lambda item: (
            -item.points,
            -item.goal_diff,
            -item.goals_for,
            item.slot,
        ),
    )


def calculate_group_tables(
    teams: dict[str, dict[str, str]], matches: list[Match]
) -> dict[str, list[TeamStats]]:
    tables: dict[str, dict[str, TeamStats]] = {group: {} for group in GROUPS}
    for team_id, team in teams.items():
        group = team["group"]
        tables[group][team_id] = TeamStats(
            team_id=team_id,
            name=team["team_name_ja"],
            group=group,
            slot=team["slot"],
        )

    for match in matches:
        if match.stage != "group" or not has_regular_score(match):
            continue
        home = tables[match.group][match.home]
        away = tables[match.group][match.away]

        home.played += 1
        away.played += 1
        home.goals_for += match.home_score or 0
        home.goals_against += match.away_score or 0
        away.goals_for += match.away_score or 0
        away.goals_against += match.home_score or 0

        if match.home_score > match.away_score:
            home.wins += 1
            away.losses += 1
            home.points += 3
        elif match.home_score < match.away_score:
            away.wins += 1
            home.losses += 1
            away.points += 3
        else:
            home.draws += 1
            away.draws += 1
            home.points += 1
            away.points += 1

    return {group: sort_stats(list(group_stats.values())) for group, group_stats in tables.items()}


def resolve_group_qualifiers(tables: dict[str, list[TeamStats]]) -> dict[str, str]:
    resolved = {}
    for group, stats in tables.items():
        if any(team.played < 3 for team in stats):
            continue
        if len(stats) >= 2:
            resolved[f"1{group}"] = stats[0].team_id
            resolved[f"2{group}"] = stats[1].team_id
        if len(stats) >= 3:
            resolved[f"3{group}"] = stats[2].team_id
    return resolved


def calculate_third_place_ranking(tables: dict[str, list[TeamStats]]) -> list[TeamStats]:
    thirds = [stats[2] for stats in tables.values() if len(stats) >= 3]
    return sort_stats(thirds)


def winner(match: Match) -> str | None:
    if not has_regular_score(match):
        return None
    if match.home_pk_score is not None and match.away_pk_score is not None:
        if match.home_pk_score == match.away_pk_score:
            return None
        return match.home if match.home_pk_score > match.away_pk_score else match.away
    if match.home_et_score is not None and match.away_et_score is not None:
        if match.home_et_score == match.away_et_score:
            return None
        return match.home if match.home_et_score > match.away_et_score else match.away
    if match.home_score == match.away_score:
        return None
    return match.home if match.home_score > match.away_score else match.away


def loser(match: Match) -> str | None:
    match_winner = winner(match)
    if match_winner == match.home:
        return match.away
    if match_winner == match.away:
        return match.home
    return None


def resolve_reference(value: str, resolved: dict[str, str]) -> str:
    if "/" in value:
        options = [resolved.get(part, part) for part in value.split("/")]
        return "/".join(options)
    return resolved.get(value, value)


def calculate_knockout(matches: list[Match], group_tables: dict[str, list[TeamStats]]) -> dict[str, dict[str, str]]:
    resolved = resolve_group_qualifiers(group_tables)
    knockout = {}

    for match in [item for item in matches if item.stage != "group"]:
        home = resolve_reference(match.home, resolved)
        away = resolve_reference(match.away, resolved)
        match_winner = winner(match)
        match_loser = loser(match)
        if match_winner:
            resolved[f"W-{match.match_id}"] = match_winner
        if match_loser:
            resolved[f"L-{match.match_id}"] = match_loser
        knockout[match.match_id] = {
            "stage": match.stage,
            "home": home,
            "away": away,
            "winner": match_winner or "",
            "loser": match_loser or "",
        }

    return knockout


def match_score_text(match: Match) -> str:
    if not has_regular_score(match):
        return "未入力"
    score = f"{match.home_score}-{match.away_score}"
    if match.home_et_score is not None and match.away_et_score is not None:
        score += f" 延長 {match.home_et_score}-{match.away_et_score}"
    if match.home_pk_score is not None and match.away_pk_score is not None:
        score += f" PK {match.home_pk_score}-{match.away_pk_score}"
    return score


def render_standings_markdown(tables: dict[str, list[TeamStats]], third_place: list[TeamStats]) -> str:
    lines = [
        "<!-- AUTO-GENERATED: do not edit directly. -->",
        "# 2026 FIFA World Cup standings",
        "",
        "手入力された `data/manual/matches.csv` のスコアから生成しています。",
        "",
    ]
    for group in GROUPS:
        lines.extend(
            [
                f"## Group {group}",
                "",
                "| Rank | Team | Pts | P | W | D | L | GF | GA | GD |",
                "| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
            ]
        )
        for rank, stats in enumerate(tables[group], start=1):
            lines.append(
                f"| {rank} | {stats.name} | {stats.points} | {stats.played} | "
                f"{stats.wins} | {stats.draws} | {stats.losses} | {stats.goals_for} | "
                f"{stats.goals_against} | {stats.goal_diff} |"
            )
        lines.append("")

    lines.extend(
        [
            "## Third-place ranking",
            "",
            "| Rank | Group | Team | Pts | P | W | D | L | GF | GA | GD |",
            "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
        ]
    )
    for rank, stats in enumerate(third_place, start=1):
        marker = " (advance)" if rank <= 8 else ""
        lines.append(
            f"| {rank} | {stats.group} | {stats.name}{marker} | {stats.points} | "
            f"{stats.played} | {stats.wins} | {stats.draws} | {stats.losses} | "
            f"{stats.goals_for} | {stats.goals_against} | {stats.goal_diff} |"
        )
    lines.append("")
    return "\n".join(lines)


def render_matches_markdown(matches: list[Match], teams: dict[str, dict[str, str]]) -> str:
    lines = [
        "<!-- AUTO-GENERATED: do not edit directly. -->",
        "# 2026 FIFA World Cup matches",
        "",
        "| Match | Stage | Group | JST | Home | Score | Away | Venue |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for match in matches:
        home = teams.get(match.home, {}).get("team_name_ja", match.home)
        away = teams.get(match.away, {}).get("team_name_ja", match.away)
        lines.append(
            f"| {match.match_id} | {match.stage} | {match.group} | {match.kickoff_jst} | "
            f"{home} | {match_score_text(match)} | {away} | {match.venue} |"
        )
    lines.append("")
    return "\n".join(lines)


def match_as_site_dict(match: Match, teams: dict[str, dict[str, str]]) -> dict[str, object]:
    home_team = teams.get(match.home, {})
    away_team = teams.get(match.away, {})
    return {
        "match_id": match.match_id,
        "stage": match.stage,
        "group": match.group,
        "home": match.home,
        "away": match.away,
        "home_name_ja": home_team.get("team_name_ja", match.home),
        "away_name_ja": away_team.get("team_name_ja", match.away),
        "kickoff_jst": match.kickoff_jst,
        "kickoff_local": match.kickoff_local,
        "local_timezone": match.local_timezone,
        "venue": match.venue,
        "score_home": match.home_score,
        "score_away": match.away_score,
        "penalty_home": match.home_pk_score,
        "penalty_away": match.away_pk_score,
    }


def team_as_site_dict(team_id: str, team: dict[str, str]) -> dict[str, str]:
    try:
        flag_code = FLAG_CODE_BY_TEAM_ID[team_id]
    except KeyError as exc:
        raise ValueError(f"Missing explicit flag_code mapping for {team_id}") from exc
    return {
        "team_id": team_id,
        "name_ja": team["team_name_ja"],
        "name_en": team["team_name_en"],
        "fifa_code": team_id,
        "flag_code": flag_code,
        "group": team["group"],
    }


def render_knockout_markdown(knockout: dict[str, dict[str, str]]) -> str:
    lines = [
        "<!-- AUTO-GENERATED: do not edit directly. -->",
        "# 2026 FIFA World Cup knockout",
        "",
        "| Match | Stage | Home | Away | Winner |",
        "| --- | --- | --- | --- | --- |",
    ]
    for match_id, row in knockout.items():
        lines.append(f"| {match_id} | {row['stage']} | {row['home']} | {row['away']} | {row['winner']} |")
    lines.extend(["", "## Mermaid", "", "```mermaid", "flowchart LR"])
    for match_id, row in knockout.items():
        label = f"{match_id}: {row['home']} vs {row['away']}"
        lines.append(f'  {match_id.replace("-", "_")}["{label}"]')
    lines.append("```")
    lines.append("")
    return "\n".join(lines)


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8", newline="\n")


def main() -> None:
    GENERATED_DIR.mkdir(exist_ok=True)
    teams = load_teams()
    matches = load_matches()
    group_tables = calculate_group_tables(teams, matches)
    third_place = calculate_third_place_ranking(group_tables)
    knockout = calculate_knockout(matches, group_tables)

    write_text(GENERATED_DIR / "standings.md", render_standings_markdown(group_tables, third_place))
    write_text(GENERATED_DIR / "matches.md", render_matches_markdown(matches, teams))
    write_text(GENERATED_DIR / "knockout.md", render_knockout_markdown(knockout))
    write_text(
        GENERATED_DIR / "worldcup_state.json",
        json.dumps(
            {
                "standings": {
                    group: [stats.as_dict() for stats in table]
                    for group, table in group_tables.items()
                },
                "third_place_ranking": [stats.as_dict() for stats in third_place],
                "knockout": knockout,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
    )
    write_text(
        ROOT / "data" / "worldcup2026_matches.json",
        json.dumps(
            {
                "schema_version": 1,
                "timezone": "Asia/Tokyo",
                "teams": [team_as_site_dict(team_id, team) for team_id, team in teams.items()],
                "matches": [match_as_site_dict(match, teams) for match in matches],
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
    )


if __name__ == "__main__":
    main()
