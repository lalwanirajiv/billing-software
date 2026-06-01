use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let migrations = vec![
    Migration {
      version: 1,
      description: "create_initial_tables",
      sql: include_str!("../migrations/1_init.sql"),
      kind: MigrationKind::Up,
    },
    Migration {
      version: 2,
      description: "add_indexes",
      sql: include_str!("../migrations/2_add_indexes.sql"),
      kind: MigrationKind::Up,
    },
    Migration {
      version: 3,
      description: "add_bill_no_unique_constraint",
      sql: include_str!("../migrations/3_add_constraints.sql"),
      kind: MigrationKind::Up,
    },
    Migration {
      version: 4,
      description: "add_company_settings",
      sql: include_str!("../migrations/4_company_settings.sql"),
      kind: MigrationKind::Up,
    },
    Migration {
      version: 5,
      description: "add_setup_completed_flag",
      sql: include_str!("../migrations/5_setup_completed.sql"),
      kind: MigrationKind::Up,
    },
  ];

  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(
      tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:billing.db", migrations)
        .build()
    )
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}