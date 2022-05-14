# ThinkOrSwimStudies

This project contains scripts that define new studies for use with TD Ameritrade's [ThinkOrSwim Desktop trading platform](https://www.tdameritrade.com/tools-and-platforms/thinkorswim/desktop.page).

## Features

The scripts include:

* AccumulationDayPercentGainThreshold - Tracks the minimum percent price gain required for an Accumulation Day per Market School rules. 

* AccumulationDistributionBarCount - Creates a chart of the count of days/weeks showing institutional accumulation and distribution. This is useful for measuring total accumulation/distribution in a base.

* ATRLabel - Adds a label to a chart showing the average true range and current period range. 

* ATRPercent - Displays a chart showing the Average True Range over time as a percent of the current price.

* ATRPercentWithGapIndicator - Displays a chart showing the Average True Range over time as a percent of the current price.  Gaps up or down are highlighted in green or red, respectively.

* BuyableGapUpIndicator - Adds a chart bubble indicating past buyable gaps-up.

* ClosePercentOfRange - Displays a bar chart of the close price relative to the period's price range.

* CoppockIndicator - Displays a chart of Coppock Indicator with bubbles at each buy signal.

* CumulativeIntradayVolumePercentChange - Displays a chart of the percent change in volume since 1 market session ago. Intended to be used with volume symbols like $TVOLC/Q (NASDAQ Composite Total Volume) or $TVOLC (NYSE Composite Total volume).

* CumulativeIntradayVolumePercentChangeLabel - Same as CumulativeIntradayVolumePercentChange except instead of a chart, the current value is written to label.

* DailyEMA - Displays a chart of the Exponential Moving Average of the day's closing price.

* EarningsPerShare - Displays a chart of a stock's Earnings Per Share.

* ExchangeListedNetHighLow - Shows the number of new 52-week highs minus new 52-week lows by day for the selected exchange.

* MinorHighLowIndicator - Adds a bubble when the day's high/low are the highest high/lowest low the past/future 9 sessions.

* PocketPivot - Adds a bubble on the daily chart when the stock had a Pocket Pivot buy point.

* RelativeStrengthWithNewHighIndicators - Displays a chart comparing price performance between two symbols. Useful for comparing one symbol to an index, for example. New High indicators are dots when relative strength is currently making a new high and relative strength made a new high before price.

* TwelveOfFifteenUp - Adds a wedge on top of a candle where closing price was higher than the previous candle for at least 12 of last 15 candles.

* UpDownVolumeRatio - Displays a chart of the ratio of the volume on up days versus down days. 

* VolumePercentChangeFromAverage - Displays a chart of the current period volume as a percentage of the 50-day moving average volume.

The complete source code is available on GitHub: 

https://github.com/sjjohns/ThinkOrSwimStudies

## Disclaimer

I (Scott Johnson) am not a certified financial advisor. I am not recommending any financial instruments to buy or sell. This project (ThinkOrSwimStudies) is for informational purposes only. It is not investment advice. Use this project at your own risk. All investing has a substantial risk of big losses.
