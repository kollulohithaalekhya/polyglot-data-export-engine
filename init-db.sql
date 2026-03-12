CREATE TABLE IF NOT EXISTS records (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  value DECIMAL(18,4) NOT NULL,
  metadata JSONB NOT NULL
);

INSERT INTO records (name,value,metadata)
SELECT
  'name_' || g,
  random()*1000,
  jsonb_build_object(
    'city','city_' || g,
    'country','india'
  )
FROM generate_series(1,10000000) g;